# color-logviewer

## Summary

Prints out the tail of a logfile with lines colored depending on the severity level.

## Installation

`npm install -g color-logviewer`

## Usage

The following command will display the log output with the default color map:

`color-logviewer logfile.log`

The default color map is defined as follows:

| Keyword | Color   |
| ------- | ------- |
| ERROR   | red     |
| WARN    | yellow  |
| DEBUG   | green   |
| TRACE   | blue    |

The order of the keywords in the color map determines, which color will be chosen to color the whole line. For example,
as the keyword _WARN_ comes before _INFO_, _DEBUG_ and _TRACE_, the _WARN_ keyword and its coloring gets precedence.

Alternatively you can define your own color map. Call `color-logviewer` with the `-c` switch and define key-value pairs,
where the key is the word that must occur on a line the value is a color as defined in
[https://www.npmjs.com/package/colors#text-colors](https://www.npmjs.com/package/colors#text-colors).

An example call with a custom color map could look like the following:

`color-logviewer -c ERROR=cyan,WARN=magenta,DEBUG=gray,TRACE=green logfile.log`

## Inspiration

Depending on your use cases you could create aliases in your .bashrc file to highlight only severity levels you are
interested in. For example:

```bash
# shorthand
alias clog="color-logviewer"

# highlight errors only
alias clog-error="color-logviewer -c ERROR=red"
# highlight errors and warnings only
alias clog-warn="color-logviewer -c ERROR=red,WARN=yellow"
```

## Todo

* [ ] More reliable error handling
* [ ] Before listening for new lines, display the last n lines of the logfile
* [ ] Enter key should insert blank lines, for a more "tail"-like experience
