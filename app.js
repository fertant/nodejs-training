import config from './config/config.json';
import { Product, User } from './models/index';
import { dirwatcher, emitter } from './events/dirwatcher';
import importer from './events/importer';

console.log(config.name);
let product = new Product();
let user = new User();

dirwatcher.watch('data', 3000);
emitter.on('dirwatcher:changed', importer.import);
emitter.on('dirwatcher:changed', importer.importSync);