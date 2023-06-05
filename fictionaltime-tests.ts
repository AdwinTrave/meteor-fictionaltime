import { FictionalTime } from './fictionaltime'

/**
 * Tinytest for fictionaltime
 */
//quick simple time
const correctTime = {connectedToET: false, beginning: false, units: [100, 100, 1000], separators: [":", ":"], declaration: "SUT ", declarationLocation: "before"};
const ft = new FictionalTime(correctTime);

//full SUT time
const sut = {connectedToET: false, beginning: false, units: [500, 10, 100, 100, 1000], separators: [".", " ", ":", ":"], declaration: "SUT ", declarationLocation: "before"};
const sutTime = new FictionalTime(sut);

//time anchored to ET
const anchoredTime = {connectedToET: true, beginning: new Date('2020-01-01'), units: [500, 10, 100, 100, 1000], separators: [".", " ", ":", ":"], declaration: "SUT ET ", declarationLocation: "before"};
const anchorTime = new FictionalTime(anchoredTime);

//time with strange units
const strangeTime = {};
const strTime = null;

Tinytest.add('Succesfully create a fictionaltime constiable from object.', function (test) {
  const ftCorrect = new FictionalTime(correctTime);
  test.equal(typeof(ftCorrect) === "object", true);

  //#TODO:30 add more correct tests for all scenarios
  test.instanceOf(ftCorrect, FictionalTime);
});

Tinytest.add('Fail to create fictionaltime when incorrect object is passed in.', function(test) {
  const failingTime1 = "nothing";
  test.equal(new FictionalTime(failingTime1), {});

  const failingTime2 = 58;
  test.equal(new FictionalTime(failingTime2), {});

  const failingTime3 = false;
  test.equal(new FictionalTime(failingTime3), {});

  const failingTime4 = undefined;
  test.equal(new FictionalTime(failingTime4), {});

  const failingTime5 = {connectedToET: false, beginning: false, units: "none", separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
  test.equal(new FictionalTime(failingTime5), {});

  const failingTime6 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: false, declaration: "SUT", declarationLocation: "before"};
  test.equal(new FictionalTime(failingTime6), {});

  const failingTime7 = {connectedToET: "yes", beginning: false, units: [10, 100, 100], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
  test.equal(new FictionalTime(failingTime7), {});

  const failingTime8 = {connectedToET: true, beginning: "today", units: [10, 100, 100], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
  test.equal(new FictionalTime(failingTime8), {});

  const failingTime9 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: [":", ":"], declaration: "SUT", declarationLocation: false};
  test.equal(new FictionalTime(failingTime9), {});

  const failingTime10 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: [":", ":"], declaration: "SUT", declarationLocation: "never"};
  test.equal(new FictionalTime(failingTime10), {});

  const failingTime11 = {connectedToET: false, beginning: false, units: ["bing", "bang"], separators: [":", ":"], declaration: "SUT", declarationLocation: "before"};
  test.equal(new FictionalTime(failingTime11), {});

  const failingTime12 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: [10, 20], declaration: "SUT", declarationLocation: "before"};
  test.equal(new FictionalTime(failingTime12), {});

  const failingTime13 = {connectedToET: false, beginning: false, units: [10, 100, 100], separators: [10, 20], declaration: "SUT", declarationLocation: "both"};
  test.equal(new FictionalTime(failingTime13), {});
});

//
// Test for the different functions
// #TODO:60 add test for non SUT times
//
Tinytest.add('toTime()', function(test){
  test.equal(ft.toTime(99000), "0:00:99");
  test.equal(ft.toTime(100000), "0:01:00");
  test.equal(sutTime.toTime(100000), "0.000 0:01:00");
  //test.equal(ft.toTime(2000), "02");
});

Tinytest.add('toDate()', function(test){
  test.equal(sutTime.toDate(9999999000), "SUT 0.099 9:99:99");
  test.equal(sutTime.toDate(10000000000), "SUT 0.100 0:00:00");
  test.equal(sutTime.toDate(49900000000), "SUT 0.499 0:00:00");
  test.equal(sutTime.toDate(50000000000), "SUT 1.000 0:00:00");
  test.equal(sutTime.toDate(100000), "SUT 0.000 0:01:00");
});

Tinytest.add('toUnit()', function(test){
  test.equal(sutTime.toUnit(50000000000, 0), 1);
  test.equal(sutTime.toUnit(100000000000, 0), 2);
});

Tinytest.add('unitToMilliseconds()', function(test){
  test.equal(sutTime.unitToMilliseconds(1, 0), 50000000000);
});

Tinytest.add('currentTime()', function(test){
  test.equal(ft.currentDateTime(), false);
});
