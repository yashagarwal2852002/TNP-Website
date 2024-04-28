const User = require('../Models/userModel.js');
const generateToken = require('../config/generateToken.js');
const bcrypt = require('bcryptjs');

const checkLoginStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'project',
            populate: {
                path: 'contributors',
                select: 'firstName middleName lastName scholarNo pic',
            },
        });

        res.status(201).json({
            isLoggedIn: true,
            user: user,
        });
    } catch (error) {
        res.status(500).json({ isLoggedIn: false, message: "Server Error" });
    }
};

const registerUser = async (req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        description,
        scholarNo,
        scholarStatus,
        fatherName,
        motherName,
        gender,
        dateOfBirth,
        category,
        community,
        nationality,
        aadharCardNo,
        contactNo,
        email,
        course,
        department,
        specialization,
        admissionYear,
        additionalEmail,
        additionalContactNo,
        education,
        experience,
        projects,
        password,
        role
    } = req.body;

    if (!firstName || !email || !password || !role) {
        res.status(400);
        throw new Error("Please enter email, password, and role");
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        firstName,
        middleName,
        lastName,
        description,
        scholarNo,
        scholarStatus,
        fatherName,
        motherName,
        gender,
        dateOfBirth,
        category,
        community,
        nationality,
        aadharCardNo,
        contactNo,
        email,
        course,
        department,
        specialization,
        admissionYear,
        additionalEmail,
        additionalContactNo,
        education,
        experience,
        projects,
        password,
        role
    });


    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            scholarNo: user.scholarNo,
            token: await generateToken(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("Faild to create the User");
    }
};

// CallBack Function to handle login Functionalities
const authUser = async (req, res) => {
    const { emailOrScholarNo, password, role } = req.body;

    const user = await User.findOne({
        $or: [{ email: emailOrScholarNo }, { scholarNo: emailOrScholarNo }]
    });
    if (user && (await user.matchPassword(password))) {
        if (user.role !== role) {
            res.status(400).json({ message: "Access Denied! Role mismatch." });
            return;
        }
        res.json({
            _id: user._id,
            email: user.email,
            token: await generateToken(user._id),
        });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
};

const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { middleName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            { scholarNo: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('firstName middleName lastName scholarNo pic');;
    res.send(users);
}

const addProject = async (req, res) => {
    try {
        const user = req.user;
        const {
            projectName,
            projectURL,
            description,
            projectstartMonth,
            projectstartYear,
            projectendMonth,
            projectendYear,
            contributors,
            currentlyWorking,
        } = req.body;

        const newProject = {
            projectName,
            projectURL,
            description,
            startDate: `${projectstartMonth} ${projectstartYear}`,
            endDate: projectendMonth && projectendYear ? `${projectendMonth} ${projectendYear}` : "Present",
            contributors: contributors ? contributors : [],
            currentlyWorking: currentlyWorking ? currentlyWorking : false,
        };

        // Add the new project to the user's projects array
        user.project.push(newProject);

        // Save the updated user
        await user.save();

        // Fetch the updated user from the database and populate the 'project' field
        const updatedUser = await User.findById(user._id).populate({
            path: 'project',
            populate: {
                path: 'contributors',
                select: 'firstName middleName lastName scholarNo pic',
            },
        });
        // Respond with the updated user profile
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ isLoggedIn: false, message: "Server Error" });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({ message: 'Old password is incorrect' });
        }
        // Update the user's password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { checkLoginStatus, registerUser, authUser, allUsers, addProject, changePassword };