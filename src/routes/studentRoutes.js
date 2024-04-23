const express = require('express');
// const { checkStudentAuthentication } = require('../middleware/authMiddleware'); // Assuming you have authentication middleware
const {
    getLaboratories,
    viewMachineAvailability,
    makeReservation,
    viewReservations,
    reportIssue,
    getLaboratoriesMachines,
} = require('../controllers/studentController'); // These should be your actual controller functions

const router = express.Router();

// Middleware to check if the user is authenticated and is a student
// TODO: Implement this middleware
//router.use(checkStudentAuthentication);

// GET list of all laboratories
router.get('/laboratories', getLaboratories);
router.get('/laboratoriesMachines', getLaboratoriesMachines);

// GET availability of machines in a specific laboratory
router.get('/laboratories/:labId/machines', viewMachineAvailability);

// POST make a new reservation
router.post('/reservations', makeReservation);

// GET view all reservations for the logged-in student
router.get('/reservations', viewReservations);

// POST report an issue with a machine
router.post('/issues', reportIssue);

module.exports = router;
