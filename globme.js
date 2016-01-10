var glob = require('glob');
var path = require('path');
var compare = require('./structural-comparison');
var nameRegex = /Abgaben\/(\D+)_\d/;

var js = glob.sync('C:/Users/amenthes/workspace/h_da 2015 P2 JS Abgaben/**/*.js');
js = js.filter(function (name) {
  var include = !name.match(/jquery[-\.]/i) && !name.includes('example-') && !name.includes('phaser.min.js') && !name.includes('raphael-min.js');
  if (!include) console.warn("Skipping %s", name);
  return include;
});

js = js.filter(function (name) {
  return !name.includes("teil2.js") && !name.includes('teil1.js');
});

js.sort(function (a, b) {
  var ba = path.basename(a);
  var bb = path.basename(b);
  if (ba > bb) { return 1; }
  if (ba < bb) { return -1; }
  return 0;
});

jsFileNumber = js.length;

console.log("<html><head><meta http-equiv='content-type' content='text/html; charset=utf-8'><style>table span {display:none;} th {writing-mode:vertical-lr; white-space:nowrap; } td {white-space:nowrap;}</style></head><body><table><tr><th></th>");
js.forEach(function (file) {
  var info = fileInfo(file);
  console.log("<th>%s / %s</th>", info.student, info.basename);
});
console.log("</tr>");


js.forEach(function (fileA, index) {
  console.error(fileA);
  var infoA = fileInfo(fileA);
  console.log("<tr><td>%s / %s</td>", infoA.student, infoA.basename);
  if (index) console.log("<td colspan='%d'></td>", index);
  for (var i = index; i < jsFileNumber; i++) {
    var fileB = js[i];
    var infoB = fileInfo(fileB);
    var diff = compare(fileA, fileB);
    var color = 'inherit';
    if (diff.structuralDifferencesCount < 5) {color = '#ffddcc';}
    if (diff.literalDifferencesCount < 10) {color = '#ff7f00';}
    if (diff.structuralDifferencesCount === 0) {color = '#ffcccc';}
    if (diff.literalDifferencesCount === 0) {color = '#ff0000';}
    if (i === index) {color = '#cccccc';}

    console.log("<td style='background-color: %s' title='Comparing %s from %s with %s from %s: S: %d / L: %d'>", color, infoA.basename, infoA.student, infoB.basename, infoB.student, diff.structuralDifferencesCount, diff.literalDifferencesCount);
    console.log("S: %d<br>L: %d", diff.structuralDifferencesCount, diff.literalDifferencesCount);
    console.log("</td>");
  }
  console.log("</tr>");
});
console.log("</table></body></html>");

function fileInfo(name) {
  var basename = path.basename(name);
  var student = name.match(nameRegex);
  return {
    student: student ? student[1] : "unknown",
    basename: basename
  };
}
