const Department = require('../models/Department');
const Employee = require('../models/Employee');

// @desc    Get all departments along with employee counts
// @route   GET /api/departments
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}).sort({ name: 1 });

        // Calculate active employee count for each department
        const departmentsWithCounts = await Promise.all(
            departments.map(async (dept) => {
                const employeeCount = await Employee.countDocuments({ department: dept.name });
                return {
                    _id: dept._id,
                    name: dept.name,
                    description: dept.description,
                    employeeCount,
                    createdAt: dept.createdAt,
                    updatedAt: dept.updatedAt
                };
            })
        );

        return res.json(departmentsWithCounts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new department
// @route   POST /api/departments
const createDepartment = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Department name and description are required' });
    }

    try {
        const exists = await Department.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
        if (exists) {
            return res.status(400).json({ message: 'Department with this name already exists' });
        }

        const department = new Department({
            name: name.trim(),
            description: description.trim()
        });

        const created = await department.save();
        return res.status(201).json({ ...created.toObject(), employeeCount: 0 });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
const updateDepartment = async (req, res) => {
    const { name, description } = req.body;

    try {
        const department = await Department.findById(req.params.id);

        if (department) {
            const oldName = department.name;
            if (name) department.name = name.trim();
            if (description) department.description = description.trim();

            const updated = await department.save();

            // If name changed, optionally update existing employees with old department name
            if (name && oldName !== name.trim()) {
                await Employee.updateMany({ department: oldName }, { department: name.trim() });
            }

            const employeeCount = await Employee.countDocuments({ department: updated.name });
            return res.json({ ...updated.toObject(), employeeCount });
        } else {
            return res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (department) {
            await Department.deleteOne({ _id: req.params.id });
            return res.json({ message: 'Department deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
