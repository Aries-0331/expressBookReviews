const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.development')});
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // validate username
  if (!username || users.some(user => user.username === username)) {
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, process.env.JWT_SECRET, { expiresIn: 3600 });
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const review = req.body.review;
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const isReviewed = books[isbn].reviews[username];
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: isReviewed ? "Review updated" : "Review added"});
  }
  return res.status(404).json({message: "Book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const isbn = req.params.isbn;
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted"});
    }
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
