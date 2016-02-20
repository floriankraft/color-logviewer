# color-logviewer

Prints out the tail of a logfile with lines colored depending on the keywords you defined.

* npm: [https://www.npmjs.com/package/color-logviewer](https://www.npmjs.com/package/color-logviewer)
* GitHub: [https://github.com/floriankraft/color-logviewer](https://github.com/floriankraft/color-logviewer)

![color-logviewer colorizing whole lines](https://raw.githubusercontent.com/floriankraft/color-logviewer/master/color-logviewer-line.png)<br/>
Default: color-logviewer colorizes whole lines

![color-logviewer coloring single words](https://raw.githubusercontent.com/floriankraft/color-logviewer/master/color-logviewer-word.png)<br/>
Use the `-s` switch to colorize single words

## Installation

`npm install -g color-logviewer`

## Synopsis

`color-logviewer [-n number_of_lines] [-c keyword=color[,keyword=color...]] -s filename`

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

The order of the keywords in the color map determines, which color will be chosen to color a line. For example, as the keyword _WARN_ comes before _INFO_, _DEBUG_ and _TRACE_, the _WARN_ keyword and its coloring gets precedence.

## Options

* `-n <number-of-lines>` By calling the command with the `-n` switch and a number, you can define how many lines will be displayed initially. (Default: 10)
* `-c <color-map>` You can define your own color map by using the `-c` switch. `<color-map>` is a String containing key-value pairs, where the key is the word that must occur on a line and the value is a color as defined in [https://www.npmjs.com/package/colors#text-colors](https://www.npmjs.com/package/colors#text-colors). (Default: See table above.)
* `-s` If you want to colorize only the word itself and not the whole line, just call the function with the -s switch.

An example call with some parameters could look like the following:

`color-logviewer -n 15 -c foo=magenta,bar=cyan logfile.log`

This will display the last 15 lines of _logfile.log_, color every line in magenta where the String "foo" occurs and every line where the String "bar" occurs in cyan. And of course it will listen for new lines and color them as well.

## Usage inspiration

Depending on your use cases you could create aliases in your .bashrc file to highlight only severity levels you are interested in. For example:

```bash
# shorthand command, returns last 20 lines before streaming starts
alias clog="color-logviewer -n 20"

# highlight only lines in which the String "ERROR" occurs
alias clog-error="clog -c ERROR=red"

# highlight only lines in which the String "ERROR" or "WARN" occurs
# (ERROR has precedence as it comes first)
alias clog-warn="clog -c ERROR=red,WARN=yellow"
```

## Troubleshooting

**Error: watch log-name.log ENOSPC**

As this program makes use of inotify on Linux systems (by using [tail](https://www.npmjs.com/package/tail) which itself uses [fs.watch](https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener)) there is a possibility of an error like the one above.

This is so, because Linux has a limit of how much files can be watched by a single user. Programs like Dropbox or the Grunt watch task make use of the same technique.

However you can increase the amount of watches a single user can have by executing the following command:

`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

As I am using a Debian based distribution I assume this will work on every other Debian-like system as well.

For Arch Linux the following seems to work, although I did not test it:

Add `fs.inotify.max_user_watches=524288` to `/etc/sysctl.d/99-sysctl.conf` and then execute `sysctl --system`.

Source: [http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc)

## History

### Changelog

#### Version 1.0.1 (2016-02-20)
* Updated README with new pictures and Troubleshooting section.

#### Version 1.0.0 (2016-01-21)
* You can now colorize words only instead of the whole line by using the -s switch.
* As this version seems to be stable enough, I decided to go up to the first major version.

#### Version 0.5.0 (2016-01-10)
* Now supports simultaneous view of multiple logfiles via wildcard character (`*`).

#### Version 0.4.1 (2016-01-07)
* Fixed: Program does not work on some Linux installations.

#### Version 0.4.0 (2015-11-12)
* Now you can insert blank lines by pressing the return key.
* The EOL character is now selected depending on the OS.

#### Version 0.3.1 (2015-11-10)
Better error handling

#### Version 0.3.0 (2015-11-10)
Display the last n lines before streaming new lines

#### Version 0.2.2 (2015-11-09)
Better error handling

#### Version 0.2.1 (2015-11-07)
Fixed typo in readme

#### Version 0.2.0 (2015-11-07)
Support of custom color maps

#### Version 0.1.1 (2015-11-07)
MIT license

#### Version 0.1.0 (2015-11-07)
Initial working version

### Todos

* [ ] Provide help function (-h)
* [ ] Provide regex pattern instead of simple search for String
* [ ] Make line endings configurable
* [ ] Solve encoding issues
* [x] Add Changelog to readme
* [x] Enter key should insert blank lines, for a more "tail"-like experience
* [x] Cross-OS end-of-line characters
* [x] Create a nice image of the program in action and show it here
* [x] More reliable error handling
* [x] Handling of `-n 0`
* [x] Before listening for new lines, display the last n lines of the logfile
