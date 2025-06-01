const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    const {username, password} = req.body;
    
    if (!username || !password) {
         return res.status(400).json({ message: 'Username or password not provided' }) 
        } 
    
    if (users.includes(username)) { 
        return res.status(400).json({ message: 'The username already in usage, please try it with another username' }) 
        } 
    else { 
        users.push({ username, password }) 
        return res.status(200).json({ message: 'The user has been successfully registered' }) 
        }

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

    try {
        const fetchedBooks = await new Promise(resolve => {
         setTimeout(() => {
             resolve(books);
         }, 100);
        });

     return res.status(200).json(fetchedBooks);
        //Stringifying the output
        //return res.send(JSON.stringify(books));
    } catch (error){
        console.error("Error while fetching books:", error);
        return res.status(500).json({message: "An unexpected error occurred while fetching books"});
    }

});

function getBookByIsbn(isbn){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundBook = books[isbn];

            if(foundBook){
                resolve(foundBook);
            } else {
                reject(new Error(`Book with this ${isbn} has not been found`));
            }
        }, 100)
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {

    const isbn = req.params.isbn;
    try {
        const book = await getBookByIsbn();
        return res.status(200).json(book);
    } catch (error) {
        console.error(`Error while fetching details for the book with isbn ${isbn}`);
        return res.status(404).json({message: `The book with  isbn ${isbn} has not been found`})
    }

    // const isbn = req.params.isbn;

    // if(isbn > 0 && isbn < 11){
    //     res.send(books[isbn])
    // } else {
    //     res.send("The book with isbn " + isbn + " has not been found. Try again later, please");
    // }

 });

 
function getBookByAuthor(author){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        
            const foundBooks = books.filter((book) => book.author === author);
            if(foundBooks.length > 0){
                resolve(foundBooks);
            } else {
                reject(new Error(`Books written by this ${author} have not been found`));
            }
        }, 100)
    });
}
   
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    try{
        const foundBooks = await getBookByAuthor();
        return res.status(200).json(foundBooks);
    } catch (error) {
        console.error(`Error while fetching book of this author ${author}`);
        return res.status(505).json({message: `No book of this author ${author} has been found`})
    }

});

    // const author = req.params.author;

    // const authorOfBooks = Object.values(books).filter(
    //     (books) => books.author === author
    //   )
    //   if (authorOfBooks.length === 0) {
    //     res.send('The database does not containy any books of this author')
    //   } else {
    //     res.send(authorOfBooks)
    //   }

function getBooksByTitle(title){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundBooksByTitle = books.filter((book) => book.title === title);
            if(foundBooksByTitle.length > 0){
                resolve(foundBooksByTitle)
            } else {
                reject(`Error while fetching books with title ${title}`);
            }
        }, 100)
    })
}
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;

    try {
        const foundBooksByTitle = await getBooksByTitle();
        return res.status(200).json(foundBooksByTitle); 
    } catch (error) {
        console.error(`Error while fetching books with title ${title}`);
        return res.status(505).json({message: `No book with title ${title} has been found`});

    }

    // const titleOfBooks = Object.values(books).filter(
    //     (books) => books.title === title
    // )
    // if(titleOfBooks.length === 0){
    //     res.send('The database does not contain any book with this title')
    // } else {
    //     res.send(titleOfBooks)
    // }
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
