import config from './config/config.json';
import Product from './models/Product.js';
import User from './models/User.js';

console.log(config.name);
let product = new Product();
let user = new User();
