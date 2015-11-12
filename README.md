# color-logviewer

Prints out the tail of a logfile with lines colored depending on the keywords you defined.

* npm: [https://www.npmjs.com/package/color-logviewer](https://www.npmjs.com/package/color-logviewer)
* GitHub: [https://github.com/floriankraft/color-logviewer](https://github.com/floriankraft/color-logviewer)

![color-logviewer in action](https://raw.githubusercontent.com/floriankraft/color-logviewer/master/color-logviewer.png)

## Installation

`npm install -g color-logviewer`

## Synopsis

`color-logviewer [-n number_of_lines] [-c keyword=color[,keyword=color...]] filename`

## Usage

The following command will display the last 10 lines of `logfile.log` and start listening for new incoming lines:

`color-logviewer logfile.log`

All lines will be highlighted according to the default color map, which is defined as follows:

| Keyword | Color   |
| ------- | ------- |
| ERROR   | red     |
| WARN    | yellow  |
| DEBUG   | green   |
| TRACE   | blue    |

The order of the keywords in the color map determines, which color will be chosen to color a line. For example, as the
keyword _WARN_ comes before _INFO_, _DEBUG_ and _TRACE_, the _WARN_ keyword and its coloring gets precedence.

## Options

* `-n <number-of-lines>` By calling the command with the `-n` switch and a number, you can define how many lines will
be displayed initially. (Default: 10)
* `-c <color-map>` You can define your own color map by using the `-c` switch. `<color-map>` is a String containing
key-value pairs, where the key is the word that must occur on a line and the value is a color as defined in
[https://www.npmjs.com/package/colors#text-colors](https://www.npmjs.com/package/colors#text-colors). (Default: See table
above.)

A most complete call with all possible parameters could look like the following:

`color-logviewer -n 15 -c foo=magenta,bar=cyan logfile.log`

This will display the last 15 lines of _logfile.log_, color every line in magenta where the String "foo" occurs and
every line where the String "bar" occurs in cyan. And of course it will listen for new lines to arrive and color them as
well.

## Inspiration

Depending on your use cases you could create aliases in your .bashrc file to highlight only severity levels you are
interested in. For example:

```bash
# shorthand command, returns last 20 lines before streaming starts
alias clog="color-logviewer -n 20"

# highlight only lines in which the String "ERROR" occurs
alias clog-error="clog -c ERROR=red"

# highlight only lines in which the String "ERROR" or "WARN" occurs
# (ERROR has precedence as it comes first)
alias clog-warn="clog -c ERROR=red,WARN=yellow"
```

## Todo

* [ ] Solve encoding issues
* [ ] Provide regex pattern instead of simple search for String
* [ ] Add Changelog to readme
* [ ] Make line endings configurable
* [x] Enter key should insert blank lines, for a more "tail"-like experience
* [x] Cross-OS end-of-line characters
* [x] Create a nice image of the program in action and show it here
* [x] More reliable error handling
* [x] Handling of `-n 0`
* [x] Before listening for new lines, display the last n lines of the logfile
