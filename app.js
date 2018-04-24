import config from './config/config.json';
import { Product, User } from './models/index';

console.log(config.name);
let product = new Product();
let user = new User();
