const mongoose = require('mongoose');

// Simple Leave Schema for employee leave requests
const LeaveSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: [true, 'Please enter employee name'],
        trim: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    leaveType: {
        type: String,
        enum: ['Sick Leave', 'Casual Leave', 'Paid Leave'],
        required: [true, 'Please select leave type']
    },
    startDate: {
        type: String, // Format: YYYY-MM-DD
        required: [true, 'Please enter start date']
    },
    endDate: {
        type: String, // Format: YYYY-MM-DD
        required: [true, 'Please enter end date']
    },
    days: {
        type: Number,
        default: 1
    },
    reason: {
        type: String,
        required: [true, 'Please enter reason for leave'],
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);
