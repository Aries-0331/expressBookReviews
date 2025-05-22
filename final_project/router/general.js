const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (isValid(username) && password) {
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
  }
  
  return res.status(403).json({message: "Error registering user. Check username and password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({message: "Book not found"});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = decodeURIComponent(req.params.author);
  const matchedBooks = {};

  for (const [isbn, book] of Object.entries(books)) {
    if (book.author.toLowerCase() === author.toLowerCase()) {
      matchedBooks[isbn] = book;
    }
  }

  return res.status(200).json(matchedBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = decodeURIComponent(req.params.title);
  const matchedBooks = {};
  for (const [isbn, book] of Object.entries(books)) {
    if (book.title.toLowerCase() === title.toLowerCase()) {
      matchedBooks[isbn] = book;
    }
  }
  return res.status(200).json(matchedBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = decodeURIComponent(req.params.isbn);
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
