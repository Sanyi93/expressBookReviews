const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = 'fingerprint_customer';

const isValid = (username) => { //returns boolean
    //filtering the valid users
    let validUsers = users.filter((user) => {
        return user.username === username;
    });

    //if some validusers then TRUE
    if(validUsers.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsersWithPassword = users.filter((user) => {
        return (user.username === username && user.password === password);
    })

    if(validUsersWithPassword.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(404).json({message: "Error while logging in"});
    }
    // Authenticate user
    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});

        //storing accessToken & username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message: "User successfully logged in" });
    }
    else {
        return res.status(208).json({message: "Login invalid. Check the username and password, please"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.query.isbn;
    const review = req.query.review;
    const accessToken = req.header('Authorization').replace('Bearer', '')

    try {
        const decodedUser = jwt.verify(accessToken, SECRET_KEY);
        const user = users.find((user) => user.username === decodedUser.username);

        if(!books[isbn]){
            return res.status(404).json({ message: "No book with the isbn provided found"});
        }
        //if no review has been added to the book, then it has no review
        if(!books[isbn].reviews){
            books[isbn].reviews = []
        }
        // bookReviews array
        const bookReviews = books[isbn].reviews;
        //author of review
        const reviewUserAuthor = Object.keys(bookReviews).find((review) => review.username === user);

        if(reviewUserAuthor){
            books[isbn].reviews[user] = review;
            return res.status(400).json({ message: "Your review has been updated"});
        } else {
            books[isbn].reviews[user] = books[isbn].reviews[user].push(review);
            return res.status(200).json({message: "Your review has been added"});
        }
    } catch (error) {
        res.status(400).send('Authorization invalid')
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
