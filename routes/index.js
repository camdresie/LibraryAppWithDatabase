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
  res.redirect('/books'); 
}));

/* GET full list of books */
router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  res.render('index', {title: "Books", books});
}));

/* GET form for adding new book to library */
router.get('/books/new', asyncHandler(async(req, res, next) => {
  res.render('new-book', {title: "New Book"});
}));

/* POST route for adding new book to database */
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors, title: "New Book"})
    } else {
      throw error;
    }
  }
}));

/* GET book detail form */
router.get('/books/:id', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book){
    res.render('update-book', {
      title: book.title,
      book
    });
  } else {
    const noBook = new Error();
    noBook.message = "That book doesn't exist, sorry!"
    noBook.status = 404;
    throw noBook;
  }
}));

/* POST to update book in database */
router.post('/books/:id', asyncHandler(async(req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    } 
  } catch (error) {
    if (error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("/books/" + book.id, {book, errors: error.errors, title: book.title});
    } else {
      throw error;
    }
  }
}));

/* POST route to delete a book from the database */
router.post('/books/:id/delete', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book){
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
