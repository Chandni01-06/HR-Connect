const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Employee = require('./models/Employee');
const Department = require('./models/Department');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');

const path = require('path');

// Load env variables from backend/.env or root
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const seedData = async () => {
    try {
        // Connect to database
        const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hr_db';
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected for seeding...');

        // Clear existing database collections
        await User.deleteMany({});
        await Employee.deleteMany({});
        await Department.deleteMany({});
        await Attendance.deleteMany({});
        await Leave.deleteMany({});
        console.log('Cleared existing collections.');

        // 1. Create Admin user
        await User.create({
            username: 'admin',
            password: 'admin123'
        });
        console.log('Seeded Admin: username: "admin" | password: "admin123"');

        // 2. Seed Departments
        const sampleDepartments = [
            {
                name: 'Engineering',
                description: 'Software development, system architecture and IT infrastructure'
            },
            {
                name: 'Human Resources',
                description: 'Talent recruitment, employee relations, payroll and company culture'
            },
            {
                name: 'Marketing',
                description: 'Brand strategy, social media campaigns and market research'
            },
            {
                name: 'Finance',
                description: 'Budgeting, financial forecasting, accounting and audits'
            }
        ];
        await Department.insertMany(sampleDepartments);
        console.log('Seeded 4 sample departments.');

        // 3. Seed Sample Employees
        const sampleEmployees = [
            {
                name: 'Rajesh Patel',
                email: 'rajesh.patel@company.com',
                role: 'Senior Software Engineer',
                department: 'Engineering',
                salary: 85000
            },
            {
                name: 'Sunita Sharma',
                email: 'sunita.sharma@company.com',
                role: 'HR Lead',
                department: 'Human Resources',
                salary: 72000
            },
            {
                name: 'Amit Verma',
                email: 'amit.verma@company.com',
                role: 'Product Specialist',
                department: 'Marketing',
                salary: 60000
            },
            {
                name: 'Priya Nair',
                email: 'priya.nair@company.com',
                role: 'Financial Analyst',
                department: 'Finance',
                salary: 68000
            }
        ];
        const createdEmployees = await Employee.insertMany(sampleEmployees);
        console.log('Seeded 4 sample employees.');

        // 4. Seed Attendance Records for Today
        const todayStr = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const sampleAttendance = [
            {
                employeeId: createdEmployees[0]._id,
                employeeName: createdEmployees[0].name,
                date: todayStr,
                status: 'Present'
            },
            {
                employeeId: createdEmployees[1]._id,
                employeeName: createdEmployees[1].name,
                date: todayStr,
                status: 'Present'
            },
            {
                employeeId: createdEmployees[2]._id,
                employeeName: createdEmployees[2].name,
                date: todayStr,
                status: 'Work From Home'
            },
            {
                employeeId: createdEmployees[3]._id,
                employeeName: createdEmployees[3].name,
                date: todayStr,
                status: 'Absent'
            }
        ];
        await Attendance.insertMany(sampleAttendance);
        console.log('Seeded sample attendance records for today.');

        // 5. Seed Leave Requests
        const sampleLeaves = [
            {
                employeeId: createdEmployees[2]._id,
                employeeName: createdEmployees[2].name,
                leaveType: 'Sick Leave',
                startDate: todayStr,
                endDate: todayStr,
                days: 1,
                reason: 'Viral fever and doctor consultation',
                status: 'Pending'
            },
            {
                employeeId: createdEmployees[0]._id,
                employeeName: createdEmployees[0].name,
                leaveType: 'Paid Leave',
                startDate: '2026-09-15',
                endDate: '2026-09-18',
                days: 4,
                reason: 'Family wedding trip',
                status: 'Approved'
            },
            {
                employeeId: createdEmployees[3]._id,
                employeeName: createdEmployees[3].name,
                leaveType: 'Casual Leave',
                startDate: '2026-09-02',
                endDate: '2026-09-03',
                days: 2,
                reason: 'Personal errands',
                status: 'Rejected'
            }
        ];
        await Leave.insertMany(sampleLeaves);
        console.log('Seeded 3 sample leave requests.');

        console.log('Database Seeding Completed Successfully.');
        process.exit(0);
    } catch (error) {
        console.error(`Seeding error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
