// UserController.js
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const db = require('../config/db').getDb();



exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, status } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        await db.collection('users').insertOne({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            status
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user: ' + error.message });
    }
};


exports.getUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.userId);
        const user = await db.collection('users').findOne({ _id: userId }, { projection: { password: 0 } }); // Exclude password from the result

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user: ' + error.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.userId);
        const updates = req.body;

        // Optionally hash the password if it's being updated
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const result = await db.collection('users').updateOne(
            { _id: userId },
            { $set: updates }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User not found or no update made' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user: ' + error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("login request: email",email,"password", password);
    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        res.json({ message: 'Login successful', userId: user._id });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

