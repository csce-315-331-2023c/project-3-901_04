const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGOO)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error('MongoDB connection failed', err);
    });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
