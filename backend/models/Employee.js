const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add employee name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add employee email'],
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add employee contact no.'],
        trim: true,
        match: [/^[0-9+ -]{10,15}$/, "Please enter valid phone number"]
    },
    role: {
        type: String,
        required: [true, 'Please add employee job role'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Please add department'],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, 'Please add employee salary']
    }


}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
