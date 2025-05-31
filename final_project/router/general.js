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

    const authorOfBooks = Object.values(books).filter(
        (books) => books.author === author
      )
      if (authorOfBooks.length === 0) {
        res.send('The database does not containy any books of this author')
      } else {
        res.send(authorOfBooks)
      }
    });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const titleOfBooks = Object.values(books).filter(
        (books) => books.title === title
    )
    if(titleOfBooks.length === 0){
        res.send('The database does not contain any book with this title')
    } else {
        res.send(titleOfBooks)
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if(!book || !book.reviews){
        res.send("No review for the book with the isbn "+isbn+ " was found")
    } else {
        res.send(book.reviews)
    }

});

module.exports.general = public_users;
