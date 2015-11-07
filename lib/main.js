#! /usr/bin/env node
(function () {
  require('colors');

  function printColoredLine(line, colorMap) {
    var lineWasPrinted = false;
    for (var i = 0; i < colorMap.length; i++) {
      if (line.indexOf(colorMap[i].keyword) > -1) {
        var color = colorMap[i].color;
        console.log(line[color]);
        lineWasPrinted = true;
      }
    }
    if (!lineWasPrinted) {
      console.log(line);
    }
  }

  function getColorMapParameter() {
    var colorMapParam = 'ERROR=red,WARN=yellow,DEBUG=green,TRACE=blue',
        numberOfProgramParameters = process.argv.length;
    if (numberOfProgramParameters > 3) {
      for (var i = 0; i < numberOfProgramParameters; i++) {
        if (process.argv[i] === '-c') {
          colorMapParam = process.argv[i + 1];
        }
      }
    }
    return colorMapParam;
  }

  function buildColorMap() {
    var colorMapParam = getColorMapParameter(),
        keywordColorPairs = colorMapParam.split(','),
        colorMap = [];
    for (var i = 0; i < keywordColorPairs.length; i++) {
      var keywordAndColor = keywordColorPairs[i].split('=');
      colorMap.push({keyword: keywordAndColor[0], color: keywordAndColor[1]});
    }
    return colorMap;
  }

  function getFilePathParameter() {
    var filePathParam = '',
        numberOfProgramParameters = process.argv.length;
    if (numberOfProgramParameters > 2) {
      filePathParam = process.argv[numberOfProgramParameters - 1];
    }
    return filePathParam;
  }

  function init() {
    var filePathParam = getFilePathParameter();
    if (filePathParam === '') {
      console.log('You must at least define a log file.'.red);
      return;
    }
    var Tail = require('tail').Tail,
        tail = new Tail(filePathParam),
        colorMap = buildColorMap();
    tail.on('line', function (line) {
      printColoredLine(line, colorMap);
    });
  }

  init();
})();
