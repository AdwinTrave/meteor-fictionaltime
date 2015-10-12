"use strict";
/**
 * storyteller:fictionaltime
 * Create your own linear fictional time.
 *
 * @see {https://github.com/AdwinTrave/meteor-fictionaltime|Fictional Time on Github}
 *
 * @license MIT
 */

/**
 * @class FictionalTime
 *
 * Creates a fictional time from fictional time object.
 *
 */
FictionalTime = class FictionalTime {
  constructor(fictionalTimeObject){
    if(fictionalTimeObject !== (null || undefined))
    {
      //check that we have the correct format
      if( typeof(fictionalTimeObject.connectedToET) === "boolean" &&
      Array.isArray(fictionalTimeObject.units) &&
      Array.isArray(fictionalTimeObject.separators) &&
      typeof(fictionalTimeObject.declarationLocation) === "string")
      {
        //test beginning properly
        if(fictionalTimeObject.connectedToET === true)
        {
          if(typeof(fictionalTimeObject.beginning) !== "number")
          {
            console.log("Wrong date format for beginning.");
            //TODO instead of return false throw an error/exception that is not going to crash the app
            return false;
          }
        }

        //test declaration location properly
        //allowed values: before, after, none
        var decLoc = false;
        if(fictionalTimeObject.declarationLocation === "before"){
          if(typeof(fictionalTimeObject.declaration) === "string")
          {
            decLoc = true;
          }
        }
        if(!decLoc){
          if(fictionalTimeObject.declarationLocation === "after"){
            if(typeof(fictionalTimeObject.declaration) === "string")
            {
              decLoc = true;
            }
          }
        }
        //TODO add test cases for this
        if(!decLoc){
          if(fictionalTimeObject.declarationLocation === "both"){
            if(Array.isArray(fictionalTimeObject.declaration)){
              decLoc = true;
            } else {
              console.log("If you have declarations on both ends then they need to be in an array.");
              return false;
            }
          }
        }
        if(!decLoc)
        {
          if(fictionalTimeObject.declarationLocation === "none"){
            decLoc = true;
          }
        }
        if(!decLoc){
          console.log("Wrong declaration location.");
          return false;
        }

        //test that we have proper values in each array
        var arraysCheck = false;
        for(var i = 0; i < fictionalTimeObject.units.length; i++)
        {
          if(typeof(fictionalTimeObject.units[i]) !== "number")
          {
            arraysCheck = true;
            break;
          }
        }

        if(!arraysCheck){
          for(var i = 0; i < fictionalTimeObject.separators.length; i++)
          {
            if(typeof(fictionalTimeObject.separators[i]) !== "string")
            {
              arraysCheck = true;
              break;
            }
          }
        }

        if(arraysCheck)
        {
          console.log("Your units and separators are wrong.");
          return false;
        }

        //initialize
        this.fictionalTime = fictionalTimeObject;

        //calculate unit spaces for adding appropriate number of zeroes
        this.fictionalTime.unitLength = [];
        for (var i = 0; i < this.fictionalTime.units.length; i++) {
          if(i === 0)
          {
            this.fictionalTime.unitLength[i] = 0;
          }
          else
          {
            var count = (this.fictionalTime.units[i-1] / this.fictionalTime.units[i]).toString();
            if(count[0] == 1)
            {
              //account for symetric times with  10, 100, etc.
              this.fictionalTime.unitLength[i] = count.length - 1;
            }
            else
            {
              this.fictionalTime.unitLength[i] = count.length;
            }
          }
        }

        console.log("Fictional time was established.");
        //return this;
      }
      else
      {
        console.log("Incorrect data provided to establish fictional time.");
        return false;
      }
    }
    else
    {
      console.log("No data provided to establish fictional time.");
      return false;
    }
  }

  /**
   * @method toTime
   * @public
   *
   * Caluculates the fictional time from provided milliseconds.
   *
   * @param {int} milliseconds
   */
  toTime(milliseconds)
  {
    if(typeof(milliseconds) === "number"){
      return this.calculate(milliseconds, false, false);
    } else {
      return false;
    }
  }

  /**
   * @method toDate
   * @public
   *
   * Converts the milliseconds to date in the time.
   *
   * @param {int} milliseconds
   */
  toDate(milliseconds)
  {
    if(typeof(milliseconds) === "number"){
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
   * @param {int} Milliseconds that are to be transfered into that unit
   * @param {int} Location of the unit in the fictionalTime.units array
   */
  toUnit(milliseconds, unit){
    //get how many milliseconds is one unit
    var oneUnit = this.fictionalTime.units[unit];
    for (var i = unit + 1; i < this.fictionalTime.units.length; i++) {
      oneUnit = oneUnit * this.fictionalTime.units[i];
    }

    //calculate
    return milliseconds / oneUnit;
  }

  /**
   * Calculate specific unit from fictional time to milliseconds
   * @method unitToMilliseconds
   *
   * @param {int} count Number of units
   * @param {int} unit From what unit are we doing the conversion
   * @return {int} The calculated number in milliseconds
   */
  unitToMilliseconds(count, unit)
  {
    //get how many milliseconds is one unit
    var oneUnit = this.fictionalTime.units[unit];
    for (var i = unit + 1; i < this.fictionalTime.units.length; i++) {
      oneUnit = oneUnit * this.fictionalTime.units[i];
    }
    return count * oneUnit;
  }

  /**
   * @method currentDateTime
   *
   * Gives you the current fictional date and time if linked to ET
   *
   * @return {string}
   */
  currentDateTime(){
    if(this.fictionalTime.connectedToET){
      //first get current time in milliseconds
      var now = Date.now().getMilliseconds();
      //then get the offset
      var offset = new Date().getTimezoneOffset() * 60000;

      return this.calculate(milliseconds, true, false);
    } else {
      console.log("This fictional time is not connected to Earth date and hence this function is not available.");
      return false;
    }
  }

  /**
   * @method calculate
   * @private
   *
   *
   * @param {int} milliseconds
   * @param {boolean} date
   * @param {boolean} shorten
   * @return {string}
   */
  calculate(milliseconds, date, shorten)
  {
    //TODO account for input with minus
    //account for dates
    var minus = false;
    if(this.fictionalTime.connectedToET){
      if(date){
        //first figure out if we are before or after the time establishment
        if(milliseconds < this.fictionalTime.beginning){
          minus = true;
        }

        //subtract from milliseconds the establishment date milliseconds
        milliseconds = milliseconds - this.fictionalTime.beginning;

        if(milliseconds < 0){
          milliseconds = milliseconds * -1;
        }
      }
    }

    //now get the numbers for the parts of the fictional time
    var parts = [];

    //figure out how many milliseconds is there for each unit for optimized calculations
    var unitsMilliseconds = [];
    for (var i = 0; i < this.fictionalTime.units.length; i++) {
      //calculate how much milliseconds does the current unit contain
      unitsMilliseconds[i] = this.fictionalTime.units[i];

      //multiply with the remaining units to get to milliseconds
      for (var k = i+1; k < this.fictionalTime.units.length; k++) {
        unitsMilliseconds[i] = unitsMilliseconds[i] * this.fictionalTime.units[k];
      }
    }

    for (var i = 0; i < this.fictionalTime.units.length; i++) {
      //first calculate how many units are there
      var count = Math.floor( Math.abs( milliseconds / unitsMilliseconds[i]) );

      //calculate what is the maximum of the given unit
      var max = 0;
      if(i !== 0){
        max = unitsMilliseconds[i-1] / unitsMilliseconds[i];
      }

      //if this is a date before the establishment of time
      //the last units which is assumed to be equivalent to years
      //should be counting down compare to the other units
      if(date && minus && i === 0){
        //get the correct number that is going to be increasing
        parts[i] = max-count;
        //account for getting the max number displayed
        if(count === max){
          parts[i] = 0;
          parts[i-1] = parseInt(parts[i-1]) - 1;
        }
      } else {
        //calculate how much of the given unit is there in the time
        parts[i] = count;

        //account for getting the max unit
        if(count === max){
          parts[i] = 0;
          parts[i-1] = parseInt(parts[i-1]) + 1;
        }
     }

     //reduce the time by the unit calculated
     milliseconds = milliseconds - (count * unitsMilliseconds[i]);
    }
    //console.log(parts);

    //if one of the separators is space and if beyond it there are no values,
    //just get rid of that part all the way to separator
    //shorten variable dictates this behavior

    //add missing zeroes to units
    parts = this.defaultZeroes(parts);

    //format time
    var outputString = this.formatTime(parts, minus);

    if(date){
      //add time declaration
      if(this.fictionalTime.declarationLocation === "before"){
       outputString = this.fictionalTime.declaration + outputString;
      }

      if(this.fictionalTime.declarationLocation === "after"){
        outputString += this.fictionalTime.declaration;
      }

      if(this.fictionalTime.declarationLocation === "both"){
        outputString = this.fictionalTime.declaration[0] + outputString + this.fictionalTime.declaration[1];
      }
    }

    return outputString;
  }

  /**
   * @method defaultZeroes
   * @private
   *
   * @param {array} parts
   * @return {array} array of strings to be put together
   */
  defaultZeroes(parts)
  {
    var returnParts = [];

    for (var i = 0; i < parts.length; i++) {
      //the first number does not need additional zeroes
      if(i !== 0){
        var number = parts[i].toString();
        var max = this.fictionalTime.units[i-1].toString();
        var add;

        //first determine how many zeroes need to be added
        if(max[0] === "1" && max[max.length-1] === "0"){
          add = (max.length - 1) - number.length;

          //prevent incorrect minus values
          if(add < 0){
            add = 0;
          }
        } else {
          add = max.length - number.length;
        }

        //add the zeroes before the given number
        for (var k = 0; k < add; k++) {
          number = "0" + number;
        }

        //add number back to the array
        returnParts[i] = number;
      } else {
        var number = parts[i].toString();
        returnParts[i] = number;
      }
    }
    return returnParts;
  }

  /**
   * @method formatTime
   * @private
   *
   * @param {array} parts of the time
   * @param {boolean} minus
   * @return {string} the final look of the time
   */
  formatTime(parts, minus)
  {
     //return the string to display the time
     var outputString = "";
     for (var i = 0; i < parts.length; i++) {
       //unit declaration before time
       if(i === 0 && minus)
       {
         //add the minus before declaration
         outputString += "-";
      }

      outputString += parts[i];

      //account for last empty separator
      if(i !== this.fictionalTime.separators.length){
        outputString += this.fictionalTime.separators[i];
      }
     }
     return outputString;
  }
}
