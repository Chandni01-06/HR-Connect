const Leave = require('../models/Leave');

// Helper to calculate inclusive days between start and end dates
const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const [y1, m1, d1] = startDate.split('-').map(Number);
    const [y2, m2, d2] = endDate.split('-').map(Number);
    if (!y1 || !y2) return 1;
    const date1 = new Date(Date.UTC(y1, m1 - 1, d1));
    const date2 = new Date(Date.UTC(y2, m2 - 1, d2));
    const diffTime = date2.getTime() - date1.getTime();
    if (isNaN(diffTime) || diffTime < 0) return 1;
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// @desc    Get all leave requests
// @route   GET /api/leaves
const getLeaves = async (req, res) => {
    try {
        const query = {};
        if (req.query.status) {
            query.status = req.query.status;
        }
        const leaves = await Leave.find(query).sort({ createdAt: -1 });
        const leavesWithDays = leaves.map(leave => {
            const obj = leave.toObject();
            obj.days = calculateDays(obj.startDate, obj.endDate);
            return obj;
        });
        return res.json(leavesWithDays);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new leave request
// @route   POST /api/leaves
const createLeave = async (req, res) => {
    const { employeeName, employeeId, leaveType, startDate, endDate, reason } = req.body;

    if (!employeeName || !leaveType || !startDate || !endDate || !reason) {
        return res.status(400).json({ message: 'All leave details are required' });
    }

    try {
        const days = req.body.days || calculateDays(startDate, endDate);
        const leave = new Leave({
            employeeName,
            employeeId,
            leaveType,
            startDate,
            endDate,
            days,
            reason,
            status: 'Pending'
        });

        const createdLeave = await leave.save();
        return res.status(201).json(createdLeave);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// @desc    Update leave request status (Approve/Reject) or details
// @route   PUT /api/leaves/:id
const updateLeave = async (req, res) => {
    const { status, leaveType, startDate, endDate, reason } = req.body;

    try {
        const leave = await Leave.findById(req.params.id);

        if (leave) {
            if (status) leave.status = status;
            if (leaveType) leave.leaveType = leaveType;
            if (startDate) leave.startDate = startDate;
            if (endDate) leave.endDate = endDate;
            if (reason) leave.reason = reason;
            leave.days = calculateDays(leave.startDate, leave.endDate);

            const updatedLeave = await leave.save();
            return res.json(updatedLeave);
        } else {
            return res.status(404).json({ message: 'Leave request not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a leave request
// @route   DELETE /api/leaves/:id
const deleteLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (leave) {
            await Leave.deleteOne({ _id: req.params.id });
            return res.json({ message: 'Leave request deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Leave request not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getLeaves,
    createLeave,
    updateLeave,
    deleteLeave
};
