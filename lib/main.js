(function () {

  var args = process.argv,
      parameterObject = {};

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

  function colorizeWords(line, keyword, color) {
    return line.replace(new RegExp(keyword, 'g'), keyword[color]);
  }

  function printColoredLine(line) {
    var coloredLine = line;
    for (var i = 0; i < parameterObject.colorMap.length; i++) {
      var keyword = parameterObject.colorMap[i].keyword,
          color = parameterObject.colorMap[i].color;
      if (coloredLine.indexOf(keyword) > -1) {
        if (parameterObject.singleWordMode) {
          coloredLine = colorizeWords(coloredLine, keyword, color);
        } else {
          coloredLine = coloredLine[color];
          break;
        }
      }
    }
    console.log(coloredLine);
  }

  function listenForFileEvents(filePath) {
    var Tail = require('tail').Tail,
        tail = new Tail(filePath, parameterObject.EOL);
    tail.on('line', function (line) {
      printColoredLine(line);
    });
  }

  function printLastLines(fileContent) {
    var allLines = fileContent.trim().split(parameterObject.EOL);
    if (parameterObject.numberOfLines > 0) {
      var lastLines = allLines.slice(-1 * parameterObject.numberOfLines);
      for (var i = 0; i < lastLines.length; i++) {
        printColoredLine(lastLines[i]);
      }
    }
  }

  function startPrintingLinesForFile(filePath) {
    var fs = require('fs');
    fs.readFile(filePath, 'utf-8', function (err, fileContent) {
      if (err) {
        var errorMsg = 'File ' + filePath + ' does either not exist or you do not have permission.';
        console.log(errorMsg.red);
      } else {
        printLastLines(fileContent);
        listenForFileEvents(filePath);
      }
    });
  }

  function buildColorMap(colorMapParameter) {
    var keywordColorPairs = colorMapParameter.split(','),
        colorMap = [];
    for (var i = 0; i < keywordColorPairs.length; i++) {
      var keywordAndColor = keywordColorPairs[i].split('=');
      colorMap.push({keyword: keywordAndColor[0], color: keywordAndColor[1]});
    }
    return colorMap;
  }

  function hasParameter(paramName) {
    for (var i = 0; i < args.length; i++) {
      if (args[i] === paramName) {
        args.splice(i, 1);
        return true;
      }
    }
    return false;
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
    parameterObject.numberOfLines = getParameter('-n', 10);
    parameterObject.colorMap = buildColorMap(getParameter('-c', 'ERROR=red,WARN=yellow,DEBUG=green,TRACE=blue'));
    parameterObject.singleWordMode = hasParameter('-s');
    parameterObject.files = args;
    parameterObject.EOL = require('os').EOL;

    // Exit program if no files have been defined
    if (parameterObject.files.length === 0) {
      console.log('You must at least define a log file.'.red);
      return;
    }

    for (var i = 0; i < parameterObject.files.length; i++) {
      startPrintingLinesForFile(parameterObject.files[i]);
    }
    listenForKeyEvents();
  }

  init();
})();
