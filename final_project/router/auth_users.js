const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = 'fingerprint_customer';
const testUserPayload = { username: 'TOMAS', role: 'customer' };
const accessToken = jwt.sign(testUserPayload, SECRET_KEY, { expiresIn: '1h' });
console.log('Generated Test Token:', accessToken);
// Copy this token for your curl commands

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
        const accessToken = jwt.sign(testUserPayload, SECRET_KEY, { expiresIn: '60 * 60' });

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

    const isbn = req.params.isbn;
    const reviewText = req.body.review;

    //authorizationHeader
    const authorizationHeader = req.header('Authorization');
    if(!authorizationHeader || !authorizationHeader.startsWith('Bearer ')){
        return res.status(401).json({message: "Authorization header incorrect"});
    }

    //accessToken by replacing
    const accessToken = authorizationHeader.replace('Bearer ', '');

    try {
        const decodedUser = jwt.verify(accessToken, SECRET_KEY);
        //extracting username from the token
        const reviewerUsername = decodedUser.username;

        if(!reviewText){
            return res.status(400).json({message: "Review content required"});   
        }

        //searching for the book
        let book = books.find((book) => book.isbn === isbn);

        if(!book){
            return res.status(404).json({message: "No book with this isbn found"});
        }

        //if the book does not possess any any review than reviews Object is to be empty
        if (!book.reviews) {
            book.reviews = {};
        }

      

        //checking if the user has already written a review for the book with this particular isbn
        if(Object.prototype.hasOwnProperty.call(book.reviews, reviewerUsername)){
            //if yes
            book.reviews[reviewerUsername] = reviewText;
            return res.status(200).json({message: "Your review has been successfully updated"});
        } else {
            book.reviews[reviewerUsername] = reviewText;
            return res.status(201).json({message: "Your review has been successfully added"});
        }

    } catch (error){
        console.error("Access token invalid: ", error);
        return res.status(401).json({message: "The user unauthorized or session expired"});
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
