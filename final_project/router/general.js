const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(400).json({ message: "Username already exists" });
    }
  } else {
    return res.status(400).json({ message: "Both username and password should be provided" });
  }
});

const getBookFromIsbn = (isbn) => {
  if (!Object.keys(books).includes(isbn)) {
    return null;
  }
  return books[isbn];
}

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  if (!books) {
    return res.status(400).json({ message: "Books do not exist" });
  }
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = getBookFromIsbn(isbn);
  if (!book) {
    return res.status(400).json({ message: `Book with ISBN ${isbn} does not exist` });
  }
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const isbns = Object.keys(books);
  const bookWithAuthorIsbn = isbns.find(isbn => books[isbn].author === author);
  if (!bookWithAuthorIsbn) {
    return res.status(400).json({ message: `Book with author ${author} does not exist` });
  }
  return res.status(200).json(books[bookWithAuthorIsbn]);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const isbns = Object.keys(books);
  const bookWithTitleIsbn = isbns.find(isbn => books[isbn].title === title);
  if (!bookWithTitleIsbn) {
    return res.status(400).json({ message: `Book with title ${title} does not exist` });
  }
  return res.status(200).json(books[bookWithTitleIsbn]);
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = getBookFromIsbn(isbn);
  if (!book) {
    return res.status(400).json({ message: `Book with ISBN ${isbn} does not exist` });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
