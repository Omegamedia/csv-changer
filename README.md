
# CSV-Changer

> Just a simple/specific set of tools to perform on csv files

> Written in typescript

## Usage

```js

const csvChanger = require('csv-changer');


/* List of functions */

/**
 * updateCsv
 * do changes to existing csv and then create a new file
 */
let status = await csvChanger.updateCsv({
    test: false,
    filename: 'currentfile.csv',
    newfilename: 'newfile.csv', // will be created within the same path as original file
    delimiter: ';', // will be used for reading and writing csv
    type: 'move_inside',
    excel: true, // Format csv to prevent old bug in excel for numbers and date
    quotes: false, // When writing to file, Default = true  
    options: {
        columnA: "order",// column to find value in
        columnB: "product",// column to insert value
        findValue: column => return column // function to return variable from column
    },
    path: "absoulute path to file folder",
})
// => result

```
