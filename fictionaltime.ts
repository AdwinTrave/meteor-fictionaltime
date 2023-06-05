import { Log } from 'meteor/logging'
import type { EarthTimeBreakdown } from './fictionaltime.d'
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
  toTime(milliseconds: number) {
    if(typeof(milliseconds) === "number") {
      return this.addDeclarator(this.calculate(milliseconds, false, true));
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
  toDate(milliseconds: number) {
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
  toUnit(milliseconds: number, unit: number): number {
    const unitIndex = Number(unit)
    //get how many milliseconds is one unit
    let oneUnit = this.fictionalTime.units[unitIndex];
    for (let i = unitIndex + 1; i < this.fictionalTime.units.length; i++) {
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
  unitToMilliseconds(count: number, unit: number): number {
    const unitIndex = Number(unit)
    //get how many milliseconds is one unit
    let oneUnit = this.fictionalTime.units[unitIndex];
    for (let i = unitIndex + 1; i < this.fictionalTime.units.length; i++) {
      oneUnit = oneUnit * this.fictionalTime.units[i];
    }
    return count * oneUnit;
  }

  /**
   * Converts milliseconds to days, hours, minutes, seconds
   * @method millisecondsToET
   * @public
   *
   * @aram milliseconds {Number}
   * @return {Object}
   */
  millisecondsToET(milliseconds: number): EarthTimeBreakdown {
    let seconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    let hours = Math.floor(minutes / 60)
    minutes = minutes % 60
    let days = Math.floor(hours / 24)
    hours = hours % 24
    const ms = Math.floor((milliseconds % 1000) * 1000) / 1000
    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds: ms,
    }
  }

  /**
   * @method currentDateTime
   * @public
   *
   * Gives you the current fictional date and time if linked to ET
   *
   * @return {String}
   */
  currentDateTime(): null | string {
    if (!this.fictionalTime.connectedToET) {
      Log.error('This fictional time is not connected to Earth date and hence this function is not available.');
      return null;
    }
    //first get current time in milliseconds
    let now = new Date().getTime();
    //then get the offset
    let offset = new Date().getTimezoneOffset() * 60000;

    return this.calculate(now + offset, true, false);
  }

  /**
   * @method countdownToTimeStart
   * @public
   *
   * @return {String}
   */
  countdownToTimeStart(): null | string {
    if (!this.fictionalTime.connectedToET || new Date().getTime() >= this.fictionalTime.beginning) return null

    //first get current time in milliseconds
    let now = new Date().getTime();
    //then get the offset
    let offset = new Date().getTimezoneOffset() * 60000;

    return this.calculate(now + offset, true, false);
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
  calculate(milliseconds: number, date: boolean, shorten: boolean): string {
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

    //if one of the separators is space and if beyond it there are no values,
    //just get rid of that part all the way to separator
    //shorten constiable dictates this behavior

    //add missing zeroes to units
    parts = this.defaultZeroes(parts);
    // Log.debug(parts);
    //format time
    let outputString = this.formatTime(parts, minus, shorten);

    if(date) {
      outputString = this.addDeclarator(outputString)
    }

    return outputString;
  }

  /**
   * Add time declaration to time string
   * @param dateString {String}
   * @return {String}
   */
  addDeclarator(dateString: string): string {
    const { declaration } = this.fictionalTime
    if(this.fictionalTime.declarationLocation === "before"){
      dateString = `${declaration}${dateString}`;
    }

    if(this.fictionalTime.declarationLocation === "after"){
      dateString += declaration;
    }

    if(this.fictionalTime.declarationLocation === "both"){
      dateString = `${declaration[0]}${dateString}${declaration[1]}`;
    }
    return dateString
  }

  /**
   * @method defaultZeroes
   * @private
   *
   * @param {[String]} parts
   * @return {Array} array of strings to be put together
   */
  defaultZeroes(parts: string[]): string[] {
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

  regex = new RegExp(/^[0]*$/)

  /**
   * @method formatTime
   * @private
   *
   * @param {[String]} parts of the time
   * @param {Boolean} minus
   * @param {Boolean} shorten
   * @return {String} the final look of the time
   */
  formatTime(parts: string[], minus: boolean, shorten: boolean): string {
    //return the string to display the time
    let outputString = "";
    let shortenerStop = false;

    const combineUnitSeparator = (outputString, part, i) => {
      outputString += part;
      //account for last empty separator
      if(i !== this.fictionalTime.separators.length) {
        outputString += this.fictionalTime.separators[i];
      }
      return outputString;
    }

    parts.forEach((part, i) => {
      //unit declaration before time
      if(i === 0 && minus) {
        //add the minus before declaration
        outputString += "-";
      }

      if (shorten && !shortenerStop) {
        if (!this.regex.test(part)) {
          outputString = combineUnitSeparator(outputString, part, i)
          shortenerStop = true
        }
      } else {
        outputString = combineUnitSeparator(outputString, part, i)
      }
    });
    return outputString;
  }
}
