//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself!
const express = require('express');
const router = express.Router();

//const parseBody = require('parse-body');

const users = []

router.get('/addUser', (req, res, next) => {
  res.render('pages/add-user', {
    title: 'Add User',
    path: '/ta02/addUser', // For pug, EJS
    activeTA03: true, // For HBS
    contentCSS: true, // For HBS
  });
});

router.post('/addUser', (req, res, next) => {
  if(!users.includes(req.body.user)){
    users.push(req.body.user)
  }
console.log(users)
res.redirect('/ta02');
});

router.get('/removeUser', (req, res, next) => {
  res.render('pages/remove-user', {
    title: 'Remove User',
    path: '/ta02/removeUser', // For pug, EJS
    activeTA03: true, // For HBS
    contentCSS: true, // For HBS
  });
});

router.post('/removeUser', (req, res, next) => {

  const index = users.indexOf(req.body.user);
if (index > -1) {
  users.splice(index, 1);
}
console.log(users)
res.redirect('/ta02');
});

router.get('/', (req, res, next) => {
  res.render('pages/ta02', {
    title: 'Team Activity 02',
    path: '/ta02', // For pug, EJS
    activeTA03: true, // For HBS
    contentCSS: true, // For HBS
    users: users,
  });
});


exports.routes = router
exports.users = users
