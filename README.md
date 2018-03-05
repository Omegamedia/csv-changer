
# CSV-Changer

> Just a simple/specific set of tools to perform on csv files


## Install

```
$ npm install https://github.com/omegamedia/csv-changer
```

## Usage

```js

const csvChanger = require('csv-changer');


/**
 * updateCsv
 * do changes to existing csv and then create a new file
 */
let status = await csvChanger.updateCsv({
    test: false,
    filename: 'currentfile.csv',
    newfilename: 'newfile.csv',
    delimiter: ';',
    type: 'move_inside',
    options: {
        columnA: "order",// column to find value in
        columnB: "product",// column to insert value
        findValue: column => return column // function to return variable from column
    },
    path: req.file.path,
})
// => result

```
