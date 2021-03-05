[![MIT License][license-image]][license-url]
[![Build Status](https://travis-ci.org/StorytellerCZ/meteor-fictionaltime.svg?branch=master)](https://travis-ci.org/StorytellerCZ/meteor-fictionaltime)
[![Code Climate](https://codeclimate.com/github/StorytellerCZ/meteor-fictionaltime/badges/gpa.svg)](https://codeclimate.com/github/StorytellerCZ/meteor-fictionaltime)
[![Test Coverage](https://codeclimate.com/github/StorytellerCZ/meteor-fictionaltime/badges/coverage.svg)](https://codeclimate.com/github/StorytellerCZ/meteor-fictionaltime/coverage)
[![Issue Count](https://codeclimate.com/github/StorytellerCZ/meteor-fictionaltime/badges/issue_count.svg)](https://codeclimate.com/github/StorytellerCZ/meteor-fictionaltime)

# Under development, use with caution!

# Fictional time
Fictional time allows you to create, display and convert units to and from your own (symetric) fictional time.
Check out examples at (website under development): [fictionaltime.meteor.com](http://fictionaltime.meteor.com).

## Installation
`meteor add storyteller:fictionaltime`

Now you can create your own fictional time anywhere in the code like this:
```javascript
const myTime = new FictionalTime({connectedToET: false, beginning: false, units: [10, 100, 1000], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"});
```

## How to use
### Creating time
In order to create a time you need the following values:
* Array with the length of each unit in milliseconds
* Begging date for your time in milliseconds (use `new Date("your date").valueOf()` or the same with Moment.js) if you choose to lock it with Earth Time.
* Unit separators array with time declarator (this means that the first value in the array is for what will be display before the time itself and the same goes for the last value, so a GMT unit separators in American style would look like this: `["/", "/", " ", ":", ":"]`)
* Declarator that will be placed "before" (`'Earth Time '`), "after" (`' GMT'`) or at "both" ends (`['Earth Time ', ' GMT']`) - don't forget the spaces - or "none".
* Where is the main unit declaration located at, options are: before, after, both, false

#### Get started - not yet working
First add the package to your project:
`meteor add storyteller:fictionaltime`

Then you can initialize fictional time anywhere in your code.
```javascript
const sut = {connectedToET: false, beginning: false, units: [500, 10, 100, 100, 1000], separators: [".", " ", ":", ":"], declaration: "SUT ", declarationLocation: "before"};
const sutTime = new FictionalTime(sut);
```

### Available functions
#### toTime
```javascript
toTime(milliseconds)
```
milliseconds - the number of milliseconds you want to dispaly in the time

TODO: shorten the displayed time only to the relevant units

Example:
```javascript
sut.toTime(100000)
```
Will return "0.000 0:01:00".
#### toDate
```javascript
toDate(milliseconds)
```
milliseconds - the number of milliseconds you want to dispaly in the time

Same as toTime, but it also includes all the units and declaration.

Example:
```javascript
sutTime.toDate(100000);
```
Will return "SUT 0.000 0:01:00".
#### toUnit
```javascript
toUnit(milliseconds, position)
```
milliseconds - the number of milliseconds you want to convert to a given unit

position - position of the unit in the units array you provided in the definition of the time

Example:
```javascript
sut.toUnit(50000000000, 0);
```
Will return 1.
#### unitToMilliseconds
```javascript
unitToMilliseconds(count, unit)
```
milliseconds - the number of milliseconds you want to convert to a given unit

position - position of the unit in the units array you provided in the definition of the time

Opposite of toUnit, will return milliseconds to of the given unit.

Example:
```javascript
sut.unitToMilliseconds(1, 0);
```
Will return 50000000000.

#### currentDateTime - coming in 0.2
If your time has an establishment date, then you can use this to display your current fictional date time.

```javascript
sut.currentDateTime();
```

#### countdown - coming in 0.2
If your time has an establishment date, then you can create a countdown to a certain Earth date and time.
```javascript
sut.countdown(new Date('2400-01-01').getMilliseconds());
```

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
