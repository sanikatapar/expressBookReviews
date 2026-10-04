const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username: username, password: password });

    return res.status(200).json({
        message: "User successfully registered"
    });
});

public_users.get('/books', function (req, res) {
    res.status(200).json(books);
});

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5001/books');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve books" });
    }
});

public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5001/books');
        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve book" });
    }
});

public_users.get('/author/:author', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5001/books');

        const result = Object.values(response.data).filter(
            book => book.author === req.params.author
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "No books found for this author" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve books" });
    }
});

public_users.get('/title/:title', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5001/books');

        const result = Object.values(response.data).filter(
            book => book.title === req.params.title
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve books" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
