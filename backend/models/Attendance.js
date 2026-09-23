const mongoose = require('mongoose');

// Simple Attendance Schema for tracking employee daily attendance
const AttendanceSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: [true, 'Please enter employee name'],
        trim: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: [true, 'Please enter date']
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Work From Home'],
        default: 'Present',
        required: [true, 'Please select attendance status']
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
