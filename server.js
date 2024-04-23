const express = require('express');
const cors = require('cors');
const { connect } = require('./src/config/db');

const app = express();
const port = process.env.PORT || 3001;
// Enable All CORS Requests for simplicity in development
// For production, you might limit it to specific domains
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connect().then(() => {
    console.log("Connected successfully to MongoDB");

    // These are moved inside the .then block
    const studentRoutes = require('./src/routes/studentRoutes');
    const professorRoutes = require('./src/routes/professorRoutes');
    const userRoutes = require('./src/routes/userRoutes');
    // Use student and professor routes
    app.use('/api/students', studentRoutes);
    app.use('/api/professors', professorRoutes);
    app.use('/api', userRoutes);
    // Start the Express server
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((error) => {
    console.error('Error starting the server:', error);
});
