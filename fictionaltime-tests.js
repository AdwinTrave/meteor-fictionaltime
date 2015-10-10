/**
 * Tinytest for fictionaltime
 */
//quick simple time
var correctTime = {connectedToET: false, beginning: false, units: [100, 100, 1000], separators: [":", ":"], declaration: "SUT ", declarationLocation: "before"};
var ft = new FictionalTime(correctTime);

//full SUT time
var sut = {connectedToET: false, beginning: false, units: [500, 10, 100, 100, 1000], separators: [".", " ", ":", ":"], declaration: "SUT ", declarationLocation: "before"};
var sutTime = new FictionalTime(sut);

//time with strange units
var strangeTime = {};
var strTime;

Tinytest.add('Succesfully create a fictionaltime variable from object.', function (test) {
  var ftcorrect = new FictionalTime(correctTime);
  test.equal(typeof(ftcorrect) === "object", true);

  //TODO add more correct tests for all scenarios
  test.instanceOf(ftcorrect, FictionalTime);
});

Tinytest.add('Fail to create fictionaltime when incorrect object is passed in.', function(test) {
  var failingTime1 = "nothing";
  test.equal(FictionalTime(failingTime1), false);

  var failingTime2 = 58;
  test.equal(FictionalTime(failingTime2), false);

  var failingTime3 = false;
  test.equal(FictionalTime(failingTime3), false);

  var failingTime4 = undefined;
  test.equal(FictionalTime(failingTime4), false);

  var failingTime5 = {connectedToET: false, beginning: false, units: "none", separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
  test.equal(FictionalTime(failingTime5), false);

  var failingTime6 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: false, declaration: "SUT", declarationLocation: "before"};
  test.equal(FictionalTime(failingTime6), false);

  var failingTime7 = {connectedToET: "yes", beginning: false, units: [10, 100, 100], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
  test.equal(FictionalTime(failingTime7), false);

  var failingTime8 = {connectedToET: true, beginning: "today", units: [10, 100, 100], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
  test.equal(FictionalTime(failingTime8), false);

  var failingTime8 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: [":", ":"], declaration: "SUT", declarationLocation: false};
  test.equal(FictionalTime(failingTime8), false);

  var failingTime9 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: [":", ":"], declaration: "SUT", declarationLocation: "never"};
  test.equal(FictionalTime(failingTime9), false);

  var failingTime10 = {connectedToET: false, beginning: false, units: ["bing", "bang"], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
  test.equal(FictionalTime(failingTime10), false);

  var failingTime11 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: [10, 20], declaration: "SUT", declarationLocation: "before"};
  test.equal(FictionalTime(failingTime11), false);

  var failingTime12 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: [10, 20], declaration: "SUT", declarationLocation: "both"};
  test.equal(FictionalTime(failingTime12), false);
});

//
// Test for the different functions
// TODO add test for non SUT times
//
Tinytest.add('toTime()', function(test){
  test.equal(ft.toTime(99000), "0:00:99");
  test.equal(ft.toTime(100000), "0:01:00");
  //test.equal(ft.toTime(2000), "02");
});

Tinytest.add('toDate()', function(test){
  test.equal(sutTime.toDate(9999999000), "SUT 0.099 9:99:99");
  test.equal(sutTime.toDate(10000000000), "SUT 0.100 0:00:00");
  test.equal(sutTime.toDate(49900000000), "SUT 0.499 0:00:00");
  test.equal(sutTime.toDate(50000000000), "SUT 1.000 0:00:00");
});

Tinytest.add('toUnit()', function(test){
  test.equal(sutTime.toUnit(50000000000, 0), 1);
  test.equal(sutTime.toUnit(100000000000, 0), 2);
});

Tinytest.add('unitToMilliseconds()', function(test){

});

Tinytest.add('currentTime()', function(test){
  test.equal(ft.currentDateTime(), false);
});
