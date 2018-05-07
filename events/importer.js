import fs from 'fs';
import path from 'path';
import events from 'events';
import async from 'async';

class Importer {
    
  listen() {
    var eventEmitter = new events.EventEmitter();
    eventEmitter.on('dirwatcher:changed', function(file) { console.log('Event ' + file); });
  }
    
  import(path) {
    console.log(path);
  }

  importSync(path) {
  }
}

module.exports = new Importer();
