[![MIT License][license-image]][license-url]

# Under development, not yet functional

# Fictional time
Fictional time allows you to create, display and convert units to and from your own (symetric) fictional time. Example at [sfb.freedombase.net](http://sfb.freedombase.net).

## Installation
`meteor add storyteller:fictionaltime`

Now you can create your own fictional time anywhere in the code like this:
```javascript
var myTime = new FictionalTime({connectedToET: false, beginning: false, units: [10, 100, 1000], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"});
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
var correctTime = {connectedToET: false, beginning: false, units: [10, 100, 1000], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
var ft = new FictionalTime(correctTime);
```

### Available functions
#### toTime
#### toDate
#### toUnit
#### unitToMilliseconds
#### currentDateTime

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
