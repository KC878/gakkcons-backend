const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const signupRoute = require('./src/sign_up/routes');
const loginRoute = require('./src/sign_in/routes');
const forgotPasswordRoute = require('./src/forgot_password/routes')


// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Use the signup route
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute); //logIn route
app.use('/api/forgot_password', forgotPasswordRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
