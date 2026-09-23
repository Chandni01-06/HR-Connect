const Attendance = require('../models/Attendance');

// @desc    Get all attendance records (optionally filter by date)
// @route   GET /api/attendance
const getAttendance = async (req, res) => {
    try {
        const query = {};
        if (req.query.date) {
            query.date = req.query.date;
        }
        // Return records sorted by date descending, then newest first
        const records = await Attendance.find(query).sort({ date: -1, createdAt: -1 });
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Mark / Create attendance record
// @route   POST /api/attendance
const createAttendance = async (req, res) => {
    const { employeeName, employeeId, date, status } = req.body;

    if (!employeeName || !date || !status) {
        return res.status(400).json({ message: 'Employee name, date and status are required' });
    }

    try {
        // Optional check: if attendance already marked for this employee on this date, update it instead of duplicate
        let existing = await Attendance.findOne({ employeeName, date });
        if (existing) {
            existing.status = status;
            if (employeeId) existing.employeeId = employeeId;
            const updated = await existing.save();
            return res.status(200).json(updated);
        }

        const record = new Attendance({
            employeeName,
            employeeId,
            date,
            status
        });

        const created = await record.save();
        return res.status(201).json(created);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// @desc    Update an attendance record
// @route   PUT /api/attendance/:id
const updateAttendance = async (req, res) => {
    const { employeeName, date, status } = req.body;

    try {
        const record = await Attendance.findById(req.params.id);

        if (record) {
            if (employeeName) record.employeeName = employeeName;
            if (date) record.date = date;
            if (status) record.status = status;

            const updated = await record.save();
            return res.json(updated);
        } else {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
const deleteAttendance = async (req, res) => {
    try {
        const record = await Attendance.findById(req.params.id);

        if (record) {
            await Attendance.deleteOne({ _id: req.params.id });
            return res.json({ message: 'Attendance record deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
};
