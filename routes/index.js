var express = require('express');
var router = express.Router();
const Book = require('../models').Book;;

///////////////////////////////////
///// HELPER FUNCTIONS
///////////////////////////////////

/**
 * Handler function to wrap each route so we don't have to write try/catch blocks for each asynchronous function 
 */
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

///////////////////////////////////
///// PAGE ROUTES
///////////////////////////////////

/**
 * GET home page. 
 */
router.get('/', asyncHandler(async(req, res, next) => {
  res.redirect('/books'); 
}));

/**
 * GET full list of books in library.
 */
router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  res.render('index', {title: "Books", books});
}));

/**
 * GET form for adding new book to library.
 */
router.get('/books/new', asyncHandler(async(req, res, next) => {
  res.render('new-book', {title: "New Book"});
}));

/**
 * POST route for adding new book to database. This route also verifies that the title and author have been entered
 * for a new book entry. If they have not, an error message is rendered saying that title and author are required
 * (the exact message depends on which was left blank).
 */
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

/**
 * GET book detail form. If a particular book does not exist in the database, this route generate a 404 error that 
 * is picked up by the error handler in app.js.
 */
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

/**
 * POST to update book in database. This route checks to make sure that the user hasn't left the title or author 
 * fields empty after updating the book entry. If they have, the page is re-rendered with an error message depending
 * on which they left blank.
 */
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
      res.render("update-book", {book, errors: error.errors, title: book.title});
    } else {
      throw error;
    }
  }
}));

/**
 * POST route to delete a book from the database. If the book doesn't exist, the user is routed to a friendly 404
 * page by the 404 error handler in app.js.
 */
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
