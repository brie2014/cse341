//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();

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

router.get('/', (req, res, next) => {
  getItemsFromFile(items => {
    res.render('pages/ta03', {
      title: 'Team Activity 03',
      path: '/ta03', // For pug, EJS
      items: items
    });
  })
})

router.post('/', (req, res, next) => {
  const keyword = req.body.keyword
  getItemsFromFile(items => {
    const filteredItems = []
    items.forEach((item) => {
      let lcTags = []
      item.tags.forEach((tag, index) => {
        let lcTag = tag.toLowerCase()
        lcTags.push(lcTag)
      })
      if (lcTags.includes(keyword.toLowerCase()) || item.name.toLowerCase().includes(keyword.toLowerCase())) {
        filteredItems.push(item)
      }
    })

    res.render('pages/ta03', {
      title: 'Team Activity 03',
      path: '/ta03', // For pug, EJS
      items: filteredItems
    });
  })
})



module.exports = router;