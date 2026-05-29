const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book);
  return res.status(404).json({message: "Book not found"});
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = Object.values(books).filter(book => book.author === author);
  if (result.length > 0) return res.status(200).json(result);
  return res.status(404).json({message: "No books found for this author"});
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = Object.values(books).filter(book => book.title === title);
  if (result.length > 0) return res.status(200).json(result);
  return res.status(404).json({message: "No books found with this title"});
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book.reviews);
  return res.status(404).json({message: "Book not found"});
});

// Task 10: Get all books using async/await
public_users.get('/async/books', async (req, res) => {
  try {
    const allBooks = await new Promise((resolve) => resolve(books));
    return res.status(200).json(allBooks);
  } catch(err) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Search by ISBN using Promise
public_users.get('/async/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if(book) resolve(book);
    else reject("Book not found");
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err}));
});

// Task 12: Search by Author async
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const result = await new Promise((resolve) => {
      resolve(Object.values(books).filter(b => b.author === author));
    });
    return res.status(200).json(result);
  } catch(err) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 13: Search by Title async
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const result = await new Promise((resolve) => {
      resolve(Object.values(books).filter(b => b.title === title));
    });
    return res.status(200).json(result);
  } catch(err) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

module.exports.general = public_users;
