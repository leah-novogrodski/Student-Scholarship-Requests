import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    birthDate: {
        type: Date
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    mobilePhone: {
        type: String
    },
    homePhone: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);