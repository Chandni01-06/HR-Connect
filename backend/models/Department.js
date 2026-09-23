const mongoose = require('mongoose');

// Simple Department Schema
const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter department name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter department description'],
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
