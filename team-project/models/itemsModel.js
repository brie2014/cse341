const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'items.json'
);

const getItemsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(tags, imageUrl, price, description, price) {
    this.tags = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }


  static fetchAll(cb) {
    getItemsFromFile(cb);
  }

//   static search(keyword, cb) {
//     getProductsFromFile(products => {
//       const product = products.find(p => p.id === id);
//       cb(product);
//     });
//   }
};
