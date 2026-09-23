const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        return res.json(employees);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new employee
// @route   POST /api/employees
const createEmployee = async (req, res) => {
    const { name, email, phone, role, department, salary } = req.body;

    try {
        const emailExists = await Employee.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        const employee = new Employee({
            name,
            email,
            phone,
            role,
            department,
            salary
        });

        const createdEmployee = await employee.save();
        return res.status(201).json(createdEmployee);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
    const { name, email, phone, role, department, salary } = req.body;

    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            employee.name = name || employee.name;
            employee.email = email || employee.email;
            employee.phone = phone || employee.phone;
            employee.role = role || employee.role;
            employee.department = department || employee.department;
            employee.salary = salary !== undefined ? salary : employee.salary;

            const updatedEmployee = await employee.save();
            return res.json(updatedEmployee);
        } else {
            return res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            await Employee.deleteOne({ _id: req.params.id });
            return res.json({ message: 'Employee removed successfully' });
        } else {
            return res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
