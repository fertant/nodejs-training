import fs from 'fs';
import path from 'path';
import events from 'events';
import async from 'async';

class ChangeEmitter extends events.EventEmitter {};

class DirWatcher {
  
  emitter;
  
  constructor() {
    this.emitter = new ChangeEmitter();
    console.log('Init emitter');
  }
    
  watch(dir, delay) {
    var results = [];
    results = this.walk(dir, results, true);
    setInterval(this.walk, delay, dir, results, false);
    this.emitter.on('dirwatcher:changed', function(file) { console.log('Event ' + file); });
  }

  walk(dir, results, first) {
    fs.readdir(dir, function(err, list) {
      var current = [];
      if (err) return console.log(err);
      var pending = list.length;
      if (!pending) return current;
      list.forEach(function (file) {
        var filePath = path.resolve(dir, file);
        fs.stat(filePath, function (err, stat) {
          if (stat && stat.isDirectory()) {
            --pending;
            var dirwatcher = new DirWatcher();
            dirwatcher.walk(dir + '/' + file, results, first);
          }
          else {
            if (!results.includes(file)){
              results.push(file);
              if (!first) {
                console.log('new file ' + file);
                this.emitter.emit('dirwatcher:changed', file);
              }
            }
            current.push(file);
          }
          if(!--pending) {
            return results;
          }
        });
      });
    });
    return results;
  }
}

module.exports = new DirWatcher();
