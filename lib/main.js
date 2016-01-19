(function () {

  var args = process.argv;

  function listenForKeyEvents() {
    var keypress = require('keypress');
    keypress(process.stdin);
    process.stdin.on('keypress', function (ch, key) {
      if (key && key.name === 'return') {
        console.log('');
      }
      if (key && key.ctrl && key.name === 'c') {
        process.exit();
      }
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
  }

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

  function listenForFileEvents(filePath, colorMap, EOL) {
    var Tail = require('tail').Tail,
        tail = new Tail(filePath, EOL);
    tail.on('line', function (line) {
      printColoredLine(line, colorMap);
    });
  }

  function printLastLines(fileContent, numberOfLines, colorMap, EOL) {
    var allLines = fileContent.trim().split(EOL);
    if (numberOfLines > 0) {
      var lastLines = allLines.slice(-1 * numberOfLines);
      for (var i = 0; i < lastLines.length; i++) {
        printColoredLine(lastLines[i], colorMap);
      }
    }
  }

  function startPrintingLinesForFile(numberOfLines, colorMap, filePath) {
    var fs = require('fs');
    fs.readFile(filePath, 'utf-8', function (err, fileContent) {
      if (err) {
        var errorMsg = 'File ' + filePath + ' does either not exist or you do not have permission.';
        console.log(errorMsg.red);
      } else {
        var EOL = require('os').EOL;
        printLastLines(fileContent, numberOfLines, colorMap, EOL);
        listenForFileEvents(filePath, colorMap, EOL);
      }
    });
  }

  function buildColorMap(colorMapParam) {
    var keywordColorPairs = colorMapParam.split(','),
        colorMap = [];
    for (var i = 0; i < keywordColorPairs.length; i++) {
      var keywordAndColor = keywordColorPairs[i].split('=');
      colorMap.push({keyword: keywordAndColor[0], color: keywordAndColor[1]});
    }
    return colorMap;
  }

  function getParameter(paramName, defaultValue) {
    var parameterValue = defaultValue;
    for (var i = 0; i < args.length; i++) {
      if (args[i] === paramName) {
        parameterValue = args[i + 1];
        args.splice(i, 2);
      }
    }
    return parameterValue;
  }

  function init() {
    require('colors');

    // Remove first and second parameter as we don't need them
    args.splice(0, 2);

    // Read parameters and/or set default values
    var parameterObject = {};
    parameterObject.numberOfLines = getParameter('-n', 10);
    parameterObject.colorMap = getParameter('-c', 'ERROR=red,WARN=yellow,DEBUG=green,TRACE=blue');
    parameterObject.files = args;

    // Exit program if no files have been defined
    if (parameterObject.files.length === 0) {
      console.log('You must at least define a log file.'.red);
      return;
    }

    var colorMap = buildColorMap(parameterObject.colorMap);
    for (var i = 0; i < parameterObject.files.length; i++) {
      startPrintingLinesForFile(parameterObject.numberOfLines, colorMap, parameterObject.files[i]);
    }
    listenForKeyEvents();
  }

  init();
})();
