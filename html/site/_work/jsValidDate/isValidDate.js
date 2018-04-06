// isValidDate.js

// Uses js Date object.
// Expect input as m/d/y.
function isValidDate(s) {
  var bits = s.split('/');
  var d = new Date(parseInt(bits[2]), parseInt(bits[0]) - 1, parseInt(bits[1]));
  return d && (d.getMonth() + 1) === parseInt(bits[0]);
}

['2/29/2024','2/29/2017','04/31/2017','10/2/2017','2/29/2016','1/1/0000'].forEach(function(s) {
  console.log('isValidDate(' + s + ') = ' + isValidDate(s));
});

console.log('');

// Checks against  
// Expect input as m/d/y.
function isValidDate2(s) {
  var bits = s.split('/');
  var m = bits[0], d = bits[1], y = bits[2];
  // Assume not leap year by default (note zero index for Jan)
  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // If evenly divisible by 4 and not evenly divisible by 100,
  // or is evenly divisible by 400, then a leap year
  if ((!(y % 4) && y % 100) || !(y % 400)) {
    daysInMonth[1] = 29;
  }
  return y>=1970 && !(/\D/.test(String(d))) && d > 0 && d <= daysInMonth[--m];
}

['2/29/2024','2/29/2017','04/31/2017','10/2/2017','2/29/2016','1/1/0000'].forEach(function(s) {
  console.log('isValidDate2(' + s + ') = ' + isValidDate2(s));
});

console.log('');

console.log('Date object tests:');
console.log("var date1 = new Date('December 17, 1995 03:24:00');");
var date1 = new Date('December 17, 1995 03:24:00');
// Sun Dec 17 1995 03:24:00 GMT...
console.log(JSON.stringify(date1));

console.log("var date2 = new Date('1995-12-17T03:24:00');");
var date2 = new Date('1995-12-17T03:24:00');
// Sun Dec 17 1995 03:24:00 GMT...
console.log(JSON.stringify(date2));

console.log('date1 === date2');
console.log(date1 === date2);
// expected output: false;

console.log('JSON.stringify(date1) === JSON.stringify(date2)');
console.log(JSON.stringify(date1) === JSON.stringify(date2));
// expected output: true;

console.log('date1 - date2');
console.log(date1 - date2);
// expected output: 0

console.log("var date3 = new Date('1995-12-18T03:24:00');");
var date3 = new Date('1995-12-18T03:24:00');
// Sun Dec 18 1995 03:24:00 GMT...
console.log(JSON.stringify(date3));
console.log('date1 - date3');
console.log(date1 - date3);
// expected output: -86400000

console.log("var date4 = new Date('1995-12-16T03:24:00');");
var date4 = new Date('1995-12-16T03:24:00');
// Sun Dec 16 1995 03:24:00 GMT...
console.log(JSON.stringify(date4));
console.log('date1 - date4');
console.log(date1 - date4);
// expected output: 86400000
console.log('24 hrs * 60 min * 60 sec * 1000 = 86400000');

