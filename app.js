import config from './config/config.json';
import { Product, User } from './models/index';
import dirwatcher from './events/dirwatcher';
import importer from './events/importer';
import events from 'events'

console.log(config.name);
let product = new Product();
let user = new User();

importer.listen();
const eventEmitter = new events.EventEmitter();
eventEmitter.on('dirwatcher:changed', function(path) {console.log('event ' + path)});
//eventEmitter.emit('dirwatcher:changed', 'file');
dirwatcher.watch('data', 3000);


