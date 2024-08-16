const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.filter(user => user.username == username).length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.filter(user => user.username == username && user.password == password).length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(authenticatedUser(username, password))
  {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).json({message: "User logged in successfully"});
  }
  else {
    return res.status(400).json({message: "User unauthenticated"});
  }

});


const getBookFromIsbn = (isbn) =>
  {
    if(!Object.keys(books).includes(isbn))
      {
        return null;
      }
      return books[isbn];
  }

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review
  const username = req.session.authorization.username
  const book = getBookFromIsbn(isbn);
  if(book)
  {
   book.reviews[username] = review 
   return res.status(200).json({"message": "review successfully added ", book});
  }
  return res.status(300).json({message: "mayvbe"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username
  const book = getBookFromIsbn(isbn);
  if(book)
  {
    if(book.reviews.hasOwnProperty(username))
    {
      delete book.reviews[username] 
      return res.status(200).json({"message": "Review successfully deleted ", book});
    }

  }
  return res.status(300).json({message: "Book with isbn " + book.isbn + " does not exist"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
