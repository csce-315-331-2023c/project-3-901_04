const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

/**
 * Establishes a connection to MongoDB using the provided connection string.
 * Logs a success message if the connection is established, otherwise logs an error.
 */
mongoose.connect(process.env.MONGOO)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error('MongoDB connection failed', err);
    });

/**
 * Defines the schema for the User model.
 * @typedef {Object} UserSchema
 * @property {string} name - User's name (required).
 * @property {string} email - User's email (required, unique).
 * @property {string} password - User's password (required).
 */

/**
 * User model based on the defined schema.
 * @type {import('mongoose').Model<UserSchema>}
 */
const User = mongoose.model("User", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

/**
 * Exports the User model for use in other parts of the application.
 * @type {import('mongoose').Model<UserSchema>}
 */
module.exports = User;
