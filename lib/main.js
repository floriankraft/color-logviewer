#! /usr/bin/env node
(function () {
  var COLOR_DEFAULT = '\033[0m',
      COLOR_BLUE = '\033[0;34m',
      COLOR_GREEN = '\033[0;32m',
      COLOR_RED = '\033[0;31m',
      COLOR_YELLOW = '\033[1;33m',
      currentColor = COLOR_DEFAULT;

  var filePath = '';
  process.argv.forEach(function (value, index) {
    if (index === 2) {
      filePath = value;
    }
  });

  var Tail = require('tail').Tail,
      tail = new Tail(filePath);

  tail.on('line', function (line) {
    if (line.indexOf('ERROR') > -1) {
      currentColor = COLOR_RED;
    } else if (line.indexOf('WARN') > -1) {
      currentColor = COLOR_YELLOW;
    } else if (line.indexOf('INFO') > -1) {
      currentColor = COLOR_DEFAULT;
    } else if (line.indexOf('DEBUG') > -1) {
      currentColor = COLOR_GREEN;
    } else if (line.indexOf('TRACE') > -1) {
      currentColor = COLOR_BLUE;
    } else {
      console.log(line);
    }
    console.log(currentColor + line);
  });
})();

// TODO: configurable colors and keywords
