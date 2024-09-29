const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');  // Fix typo here
const collection = require('./config');  // Assuming config is your MongoDB connection

const app = express();

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set view engine and static folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../view'));
app.use(express.static('public'));

// Route for login page
app.get('/', (req, res) => {
    res.render('login');
});

// Route for signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Signup POST route
app.post('/signup', async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            password: req.body.password
        };

        // Check if user already exists
        const existUser = await collection.findOne({ name: data.name });
        if (existUser) {
            return res.send('User already exists, choose a different username');
        } else {
            // Hash the password
            const saltRound = 10;
            const hashPassword = await bcrypt.hash(data.password, saltRound);

            // Update password with hashed version
            data.password = hashPassword;

            // Insert the new user into the database
            const userData = await collection.insertMany(data);
            console.log(userData);
            res.send('User registered successfully!');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during signup');
    }
});

// Login POST route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database by username
        const check = await collection.findOne({ name: username });
        if (!check) {
            return res.send('Username not found');
        }

        // Compare the hashed password with the entered password
        const isPasswordValid = await bcrypt.compare(password, check.password);
        if (isPasswordValid) {
            res.render('home');  // Assuming you have a 'home.ejs' template
        } else {
            res.send('Wrong password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during login');
    }
});

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log('Server running on port: 8000');
});
