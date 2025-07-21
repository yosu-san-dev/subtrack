import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minlength: 6,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+@\w+\.\w+$/, 'Invalid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;

//User.create();
// { name: 'Tolga wishtoter', email: 'tw@gmail.com', password: 'password'}