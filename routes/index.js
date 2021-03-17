var express = require('express');
var router = express.Router();
const Book = require('../models').Book;;

// This async Handler takes a callback function and prevents us from having to write try/catch blocks for every single route that makes a seqelize problem
/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}


/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  res.redirect('/books');
  res.json(books);
  
}));

/* GET full list of books */
router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  res.render('index', {title: "Books", books});
}));

/* GET form for adding new book to library */
router.get('/books/new', asyncHandler(async(req, res, next) => {
  res.render('new-book', {title: "New Book"})
}));

/* POST route for adding new book to database */
router.post('/books/new', asyncHandler(async(req, res, next) => {
  
}));

/* GET book detail form */
router.get('/books/:id', asyncHandler(async(req, res, next) => {

}));

/* POST to update book in database */
router.post('/books/:id', asyncHandler(async(req, res, next) => {

}));

/* POST route to delete a book from the database */
router.post('/books/:id/delete', asyncHandler(async(req, res, next) => {

}));

module.exports = router;
