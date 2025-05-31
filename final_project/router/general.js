const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Stringifying the output
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if(isbn > 0 && isbn < 11){
        res.send(books[isbn])
    } else {
        res.send("The book with isbn " + isbn + " has not been found. Try again later, please");
    }


 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    authorExists = (author) => {
        let authorsOfBooks = books.filter((author) => {
            return books.author === author;
        })
        return authorsOfBooks.length > 0;
    }

    if(authorExists){
        res.send(books[author]);
    } else {
        res.send("The author searched for is not in the database");
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
