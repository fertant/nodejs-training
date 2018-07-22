'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  database: 'models',
  username: 'postgres',
  password: 'postgres',
  dialect: 'postgres'
});
const Product = require('../models/product')(sequelize, Sequelize);
const uuid = require('uuid/v1');

/**
 * search product by id
 * Get product by id. 
 *
 * uuid String product uuid
 * returns Product
 **/
exports.getProductById = function(uuid) {
  let productId = uuid;
  return Product.findAll({where:{uuid: productId}, order: [['reviewId', 'ASC']]})
      .then(result => {
          return result.pop();
      });
}


/**
 * list of product reviews
 * List of product reviews. 
 *
 * uuid String product uuid
 * returns List
 **/
exports.getProductReviews = function(uuid) {
  let productId = uuid;
  return Product.findAll({where:{uuid: productId}})
      .then(results => {
          return results;
      });
}


/**
 * list of products
 * Get list of all products 
 *
 * returns List
 **/
exports.getProducts = function() {
  return Product.findAll({where:{}})
    .then(results => {
      return results;
    });
}


/**
 * Create new product 
 *
 * body Product  (optional)
 * returns Product
 **/
exports.postProduct = function(body) {
  let product = body;
  if (!product.uuid) {
      product.uuid = uuid();
  }
  if (!product.reviewId) {
      product.reviewId = 1;
  }
  return Product.findAll({where:{uuid: product.uuid}, order: [['reviewId', 'ASC']], raw: true})
      .then(existingProduct => {
          if(existingProduct.length > 0) {
              existingProductLast = existingProduct.pop();
              product.reviewId = parseInt(existingProductLast.reviewId) + 1;
              return Product.create(product)
                  .then(result => {
                      return result;
                  });
          }
          else {
              return Product.create(product)
                  .then(result => {
                      return result;
                  });
          }
      });
}

