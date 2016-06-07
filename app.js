"use strict";

var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('base.txt');

// data-scheme:
//     lat
// lon val
// for each month
// {
//  1880:
//    {1: { -179: [-89 - +89],
//          -177: [-89 - +89],
//          ...               }
//     2:
//    },
//  1881:
//    ...
// }

var data = {};
for (var i = 0; i <= 136; i++) {
  var year_month = {};
  for (var j = 1; j <= 12; j++) {
    var lon = {};
    for (var k = 0; k <= 358; k += 2) {
      lon[k] = Array.apply(null, Array(90)).map(Number.prototype.valueOf, 0);
    }
    year_month[j] = lon;
  }
  var year = i + 1880;
  data[year] = year_month;
}

var longitude = 0;
lr.on('line', function (line) {
  // check if new longitude or data_row
	if (line.split('(')[0] == 'tempanomaly') {
    //if longitude set curr longitude
    let tmp = line.split('=')[1];
    let lon = tmp.split('.')[0].trim();
    longitude = Number(lon) + 179;
  } else if (line.split(',')[0] != 'time_index') {
    //handle data_lines
    var data_arr = line.split(',');
    var _month = data_arr[0];

    var month = (_month % 12) + 1;
    var y = 1880 + Math.floor(_month/12);

    for (var i = 0; i < data_arr.length; i++) {
      data[y][month][longitude][i] = data_arr[i+1] / 100;
    }
  }
});

lr.on('error', function (err) {
	console.log(err);
});

lr.on('end', function () {
  // split saving files, because of nodejs memory overload
  // process first 68 years
  // for (var o = 0; o < Object.keys(data).length-68; o++) {
  // process last 68 years
  for (var o = 67; o < Object.keys(data).length; o++) {
    var _y = 1880 + o;
    require('fs').writeFile('year_' + _y + '.json', JSON.stringify(data[_y]), (err) => {
      if (err) throw err;
      console.log(_y + ' saved!');
    });
  }
  // require('fs').writeFile('data.json', JSON.stringify(data), (err) => {
  //   if (err) throw err;
  //   console.log('It\'s saved!');
  // });
});
