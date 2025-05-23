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
  new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (error) {
      reject(error);
    }
  }).then((books) => {
    return res.status(200).json(books);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching books"});
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    try {
      const isbn = req.params.isbn;
      resolve(books[isbn]);
    } catch (error) {
      reject(error);
    }
  }).then((book) => {
    return res.status(200).json(book);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching book"});
  })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    try {
      const author = decodeURIComponent(req.params.author);
      const matchedBooks = {};
      for (const [isbn, book] of Object.entries(books)) {
        if (book.author.toLowerCase() === author.toLowerCase()) {
          matchedBooks[isbn] = book;
        }
      }
      resolve(matchedBooks);
    } catch (error) {
      reject(error);
    }
  }).then((matchedBooks) => {
    return res.status(200).json(matchedBooks);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching book"});
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise((resolve, reject) => {
    try {
      const title = decodeURIComponent(req.params.title);
      const matchedBooks = {};
      for (const [isbn, book] of Object.entries(books)) {
        if (book.title.toLowerCase() === title.toLowerCase()) {
          matchedBooks[isbn] = book;
        }
      }
      resolve(matchedBooks);
    } catch (error) {
      reject(error);
    }
  }).then((matchedBooks) => {
    return res.status(200).json(matchedBooks);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching book"});
  })
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
