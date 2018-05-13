const through2 = require('through2');
const fs = require('fs');
const csvParse = require('csv-parse');
const parseArgs = require('minimist');
const pathResolve = require('path');

var help = parseArgs(process.argv.slice(2,3), {
    alias: { 'help': 'h' },
    unknown: (arg) => {
        if (arg !== 'help' && arg !== 'h') {
            return false;
        }
    }
});
if (typeof help.help === 'undefined' || !help.help) {
    var action = parseArgs(process.argv.slice(2), {
        alias: { 'action': 'a' },
        unknown: (arg) => {
            if (arg !== 'action' && arg !== 'a') {
                return false;
            }
        }
    });
    if (typeof action.action === 'undefined' || !action.action) {
        console.log('First function argument should be action and second file path.');
        return false;
    }

    switch(action.action) {
        case 'reverse':
            process.stdin.resume();
            process.stdin.setEncoding('utf-8');
            process.stdin.on('data', function(str) {
                reverse(str);
            });
            break;
        case 'transform':
            transform();
            break;
        case 'outputFile':
            file = getOption('file', 'f');
            if (file) {
                outputFile(file);
            }
            break;
        case 'convertFromFile':
            file = getOption('file', 'f');
            if (file) {
                convertFromFile(file);
            }
            break;
        case 'convertToFile':
            file = getOption('file', 'f');
            if (file) {
                convertToFile(file);
            }
            break;
        case 'cssBundler':
            path = getOption('path', 'p');
            if (path) {
                cssBundler(path);
            }
            break;
    }
}
else {
    if (help.help === 'action') {
        console.log('List of possible actions: reverse, transform, outputFile, convertFromFile, convertToFile.');
    }
    else if (help.help === 'file') {
        console.log('Enter path to file');
    }
    else {
        console.log('Possible paramenter list:');
        console.log('  --action');
        console.log('  --file');
    }
}

function getOption(option, alias) {
    var countVars = process.argv.length - 1;
    var index = 3;
    var isFound = false;
    while (!isFound && index < countVars) {
        if (process.argv[index].indexOf('--' + alias) === 0) {
            isFound = true;
        }
        else {
            index++;
        }
    }
    var file = parseArgs(process.argv.slice(index), {
        alias: { option: alias },
        unknown: (arg) => {
            if (arg.indexOf(option) === -1 && arg !== option && arg !== alias) {
                console.error('Unknown option: ', arg);
                return false;
            }
        }
    });
    var result = eval(`file.${option}`);
    if (typeof result === 'undefined' || !result) {
        result = file.option;
        if (typeof result === 'undefined' || !result) {        
          console.log('Before execute any action provide file path.');
          return false;
        }
    }
    return result;
}

/**
 * Reverse input string.
 * @param {*} str 
 */
function reverse(str) {
    str = str.split("").reverse().join("");
    process.stdout.write(str + '\n');
}

/**
 * Transfrom input to uppercase.
 */
function transform() { 
    const toUpperCase = through2((data, enc, cb) => {
        cb(null, new Buffer(data.toString().toUpperCase()));
      });
    process.stdin.pipe(toUpperCase).pipe(process.stdout);
}

/**
 * Stream file to stdout.
 * @param {*} filePath 
 */
function outputFile(filePath) {
    if (filePath.indexOf('.txt') == -1) {
        console.log('File should be txt format.');
        return;
    }
    var readStream = fs.createReadStream(filePath);
    readStream.on('data', (data) => { process.stdout.write('\n' + data.toString()) });
    readStream.on('end', () => { 
       process.stdout.write(' EOF\n');
    });
}

/**
 * Read csv file and output to stdout as json.
 * @param {*} filePath 
 */
function convertFromFile(filePath) {
    if (filePath.indexOf('.csv') == -1) {
        console.log('File should be csv format.');
        return;
    }
    fs.createReadStream(filePath)
    .pipe(csvParse({ auto_parse: true }))
    .pipe(through2.obj(function(chunk, encoding, callback) {
        this.push({
            id: chunk[0],
            data: chunk[1],
        })
        callback()
    }))
    .on('data', function(record) {
        process.stdout.write(JSON.stringify(record));
        process.stdout.write('\n');
    })
}

/**
 * Read csv file, convert to json and save to file.
 * @param {*} filePath 
 */
function convertToFile(filePath) { 
    if (filePath.indexOf('.csv') == -1) {
        console.log('File should be csv format.');
        return;
    }
    const writer = fs.createWriteStream(filePath.replace('.csv', '.json'));
    fs.createReadStream(filePath)
    .pipe(csvParse({ auto_parse: true }))
    .pipe(through2.obj(function(chunk, encoding, callback) {
        this.push({
            id: chunk[0],
            data: chunk[1],
        })
        callback()
    }))
    .on('data', function(record) {
        writer.write(JSON.stringify(record));
    })
    .on('end', () => {
        writer.end();
    });
}

/**
 * Bundle all css files from path.
 * @param {*} path 
 */
function cssBundler(path) {
    var files = [];
    var files = walkDir(path, files);
    const writer = fs.createWriteStream(path + 'bundle.css');
    var last = pathResolve.resolve(path, 'last.css');
    files.push(last);
    files.forEach(function (file) {
        var filePath = pathResolve.resolve(path, file);
        writeOutFile(writer, filePath);
    })
}

/**
 * Find all css files in passed dir.
 * @param {*} path 
 * @param {*} files 
 */
function walkDir(path, files) {
    var list = fs.readdirSync(path);
    list.forEach(function (file) {
        var filePath = pathResolve.resolve(path, file);
        var stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            files.concat(walkDir(path + '/' + file, files));
        }
        else {
            if (
                !files.includes(file) && 
                file.indexOf('.css') !== -1 && 
                file.indexOf('bundle.css') === -1 && 
                file.indexOf('last.css') === -1
            ) {
                files.push(filePath);
            }
        }
    });
    return files;
}

/**
 * Write file to write stream.
 * @param {*} writer 
 * @param {*} file 
 */
function writeOutFile(writer, file) {
    fs.createReadStream(file)
        .on('data', function(record) {
            writer.write(record);
        })
        .on('end', function() {
            writer.end();
        });
}