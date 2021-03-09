import { Log } from 'meteor/logging';
/**
 * storyteller:fictionaltime
 * Create your own linear fictional time.
 *
 * @see {https://github.com/StorytellerCZ/meteor-fictionaltime|Fictional Time on Github}
 *
 * @license MIT
 */

/**
 * @class FictionalTime
 *
 * Creates a fictional time from fictional time object.
 *
 */
export class FictionalTime {
  constructor(fictionalTimeObject){
    if (!fictionalTimeObject) {
      Log.error('No data provided to establish fictional time.');
      return false;
    }
    // Check that we have the correct format
    if (
      !Array.isArray(fictionalTimeObject.units) ||
      !Array.isArray(fictionalTimeObject.separators) ||
      typeof(fictionalTimeObject.declarationLocation) !== "string"
    ) {
      Log.error('Incorrect data provided to establish fictional time.');
      return false;
    }

    // Test beginning properly
    if(fictionalTimeObject.connectedToET && typeof(fictionalTimeObject.beginning) !== "number") {
      Log.error('Wrong date format for beginning.');
      return false;
    }

    //test declaration location properly
    //allowed values: before, after, both, none
    let decLoc = false;
    if((fictionalTimeObject.declarationLocation === "before" || fictionalTimeObject.declarationLocation === "after") && typeof(fictionalTimeObject.declaration) === "string") {
      decLoc = true;
    }
    //#TODO:40 add test cases for this
    if(!decLoc && fictionalTimeObject.declarationLocation === "both") {
      if(Array.isArray(fictionalTimeObject.declaration)) {
        decLoc = true;
      } else {
        Log.error('If you have declarations on both ends then they need to be in an array.')
        return false;
      }
    }
    if(!decLoc && fictionalTimeObject.declarationLocation === "none") {
      decLoc = true;
    }
    if(!decLoc) {
      Log.error('Wrong declaration location.')
      return false;
    }

    //test that we have proper values in each array
    let arraysCheck = false;
    for(let i = 0; i < fictionalTimeObject.units.length; i++) {
      if(typeof(fictionalTimeObject.units[i]) !== "number") {
        arraysCheck = true;
        break;
      }
    }

    if(!arraysCheck) {
      for(let i = 0; i < fictionalTimeObject.separators.length; i++) {
        if(typeof(fictionalTimeObject.separators[i]) !== "string")
        {
          arraysCheck = true;
          break;
        }
      }
    }

    if(arraysCheck) {
      Log.error('Your units and separators are wrong.')
      return false;
    }

    //initialize
    this.fictionalTime = fictionalTimeObject;

    //calculate unit spaces for adding appropriate number of zeroes
    this.fictionalTime.unitLength = [];
    for (let i = 0; i < this.fictionalTime.units.length; i++) {
      if(i === 0) {
        this.fictionalTime.unitLength[i] = 0;
      } else {
        let count = (this.fictionalTime.units[i-1] / this.fictionalTime.units[i]).toString();
        //when in string we can check what is the first number
        //TODO: we can probably do this in a more elegant way
        if(count[0] === "1") {
          //account for symmetric times with  10, 100, etc.
          this.fictionalTime.unitLength[i] = count.length - 1;
        } else {
          this.fictionalTime.unitLength[i] = count.length;
        }
      }
    }

    Log.debug('Fictional time was established.');
  }

  /**
   * @method toTime
   * @public
   *
   * Calculates the fictional time from provided milliseconds.
   *
   * @param {Number} milliseconds
   * @return {String}
   */
  toTime(milliseconds) {
    if(typeof(milliseconds) === "number") {
      return this.calculate(milliseconds, false, false);
    } else {
      return false;
    }
  }

  /**
   * @method toDate
   * @public
   *
   * Converts the milliseconds to date time in the fictional time.
   *
   * @param {Number} milliseconds
   * @return {String}
   */
  toDate(milliseconds) {
    if(typeof(milliseconds) === "number") {
      return this.calculate(milliseconds, true, false);
    } else {
      return false;
    }
  }

  /**
   * @method toUnit
   * @public
   *
   * Converts the given amount into the given unit.
   * This function is for things like calculating ET years to SUT years.
   *
   * @param milliseconds {Number} Milliseconds that are to be transferred into that unit
   * @param unit {Number} Location of the unit in the fictionalTime.units array
   */
  toUnit(milliseconds, unit){
    //get how many milliseconds is one unit
    let oneUnit = this.fictionalTime.units[unit];
    for (let i = unit + 1; i < this.fictionalTime.units.length; i++) {
      oneUnit = oneUnit * this.fictionalTime.units[i];
    }

    //calculate
    return milliseconds / oneUnit;
  }

  /**
   * Calculate specific unit from fictional time to milliseconds
   * @method unitToMilliseconds
   * @public
   *
   * @param count {Number} Number of units
   * @param unit {Number} From what unit are we doing the conversion
   * @return {Number} The calculated number in milliseconds
   */
  unitToMilliseconds(count, unit) {
    //get how many milliseconds is one unit
    let oneUnit = this.fictionalTime.units[unit];
    for (let i = unit + 1; i < this.fictionalTime.units.length; i++) {
      oneUnit = oneUnit * this.fictionalTime.units[i];
    }
    return count * oneUnit;
  }

  /**
   * @method currentDateTime
   *
   * Gives you the current fictional date and time if linked to ET
   *
   * @return {String}
   */
  currentDateTime() {
    if(this.fictionalTime.connectedToET){
      //first get current time in milliseconds
      let now = new Date().getTime();
      //then get the offset
      let offset = new Date().getTimezoneOffset() * 60000;

      return this.calculate(now + offset, true, false);
    } else {
      Log.error('This fictional time is not connected to Earth date and hence this function is not available.');
      return false;
    }
  }

  /**
   * @method calculate
   * @private
   *
   *
   * @param {Number} milliseconds
   * @param {Boolean} date
   * @param {Boolean} shorten TODO
   * @return {String}
   */
  calculate(milliseconds, date, shorten) {
    //#TODO:10 account for input with minus
    //account for dates
    let minus = false;
    if(this.fictionalTime.connectedToET && date) {
      //first figure out if we are before or after the time establishment
      if(milliseconds < this.fictionalTime.beginning){
        minus = true;
      }

      //subtract from milliseconds the establishment date milliseconds
      milliseconds = milliseconds - this.fictionalTime.beginning;
      if(milliseconds < 0) {
        milliseconds = milliseconds * -1;
      }
    }

    //now get the numbers for the parts of the fictional time
    let parts = [];

    //figure out how many milliseconds are there for each unit for optimized calculations
    let unitsMilliseconds = [];
    this.fictionalTime.units.forEach((unit, i) => {
      //calculate how much milliseconds does the current unit contain
      unitsMilliseconds[i] = unit;

      //multiply with the remaining units to get to milliseconds
      for (let k = i+1; k < this.fictionalTime.units.length; k++) {
        unitsMilliseconds[i] = unitsMilliseconds[i] * this.fictionalTime.units[k];
      }
    })
    // Log.debug(unitsMilliseconds)

    this.fictionalTime.units.forEach((unit, i) => {
      //first calculate how many units are there
      let count = Math.floor( Math.abs( milliseconds / unitsMilliseconds[i]) );

      //calculate what is the maximum of the given unit
      let max = 0;
      if(i !== 0) {
        max = unitsMilliseconds[i-1] / unitsMilliseconds[i];
      }

      //if this is a date before the establishment of time
      //the last units which is assumed to be equivalent to years
      //should be counting down compare to the other units
      if(date && minus && i === 0) {
        //get the correct number that is going to be decreasing
        parts[i] = count;
      } else {
        //calculate how much of the given unit is there in the time
        parts[i] = count;

        //account for getting the max unit
        if(count === max){
          parts[i] = 0;
          parts[i-1] = parseInt(parts[i-1], 10) + 1;
        }
     }

     //reduce the time by the unit calculated
     milliseconds = milliseconds - (count * unitsMilliseconds[i]);
    })
    // Log.debug(parts);

    //if one of the separators is space and if beyond it there are no values,
    //just get rid of that part all the way to separator
    //shorten constiable dictates this behavior

    //add missing zeroes to units
    parts = this.defaultZeroes(parts);

    //format time
    let outputString = this.formatTime(parts, minus);

    if(date) {
      const { declaration } = this.fictionalTime
      //add time declaration
      if(this.fictionalTime.declarationLocation === "before"){
       outputString = `${declaration}${outputString}`;
      }

      if(this.fictionalTime.declarationLocation === "after"){
        outputString += declaration;
      }

      if(this.fictionalTime.declarationLocation === "both"){
        outputString = `${declaration[0]}${outputString}${declaration[1]}`;
      }
    }

    return outputString;
  }

  /**
   * @method defaultZeroes
   * @private
   *
   * @param {[String]} parts
   * @return {Array} array of strings to be put together
   */
  defaultZeroes(parts) {
    let returnParts = [];

    for (let i = 0; i < parts.length; i++) {
      //the first number does not need additional zeroes
      if(i !== 0) {
        let number = parts[i].toString();
        let max = this.fictionalTime.units[i-1].toString();
        let add;

        //first determine how many zeroes need to be added
        if(max[0] === "1" && max[max.length-1] === "0") {
          add = (max.length - 1) - number.length;

          //prevent incorrect minus values
          if(add < 0){
            add = 0;
          }
        } else {
          add = max.length - number.length;
        }

        //add the zeroes before the given number
        for (let k = 0; k < add; k++) {
          number = "0" + number;
        }

        //add number back to the array
        returnParts[i] = number;
      } else {
        let number = parts[i].toString();
        returnParts[i] = number;
      }
    }
    return returnParts;
  }

  /**
   * @method formatTime
   * @private
   *
   * @param {[String]} parts of the time
   * @param {Boolean} minus
   * @return {String} the final look of the time
   */
  formatTime(parts, minus) {
     //return the string to display the time
     let outputString = "";
     for (let i = 0; i < parts.length; i++) {
       //unit declaration before time
       if(i === 0 && minus) {
         //add the minus before declaration
         outputString += "-";
       }

      outputString += parts[i];

      //account for last empty separator
      if(i !== this.fictionalTime.separators.length) {
        outputString += this.fictionalTime.separators[i];
      }
     }
     return outputString;
  }
}
