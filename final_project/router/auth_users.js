const express = require('express');
const jwt = require('jsonwebtoken');
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
      data: password
    }, 'accessToken', { expiresIn: 60 * 60 });
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
  const { username, review } = req.session.authorization;
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const isReviewed = books[isbn].reviews[username];
    if (isReviewed) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Review updated"});
    } else {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Review added"});
    }
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
