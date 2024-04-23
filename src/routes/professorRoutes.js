const express = require('express');
// const { checkProfessorAuthentication } = require('../middleware/authMiddleware'); // middleware for professors
const {
    addLaboratory,
    updateLaboratory,
    deleteLaboratory,
    viewAllReservations,
    resolveIssue,
    deleteMachine,
    addMachine,
    updateMachine
} = require('../controllers/professorController'); 

const router = express.Router();

// Middleware to check if the user is authenticated and is a professor
// router.use(checkProfessorAuthentication);

// POST add a new laboratory
router.post('/laboratories', addLaboratory);
router.post('/machine', addMachine);
router.put('/machine/:id', updateMachine);
router.delete('/machine/:identifier', deleteMachine);

// PUT update details of an existing laboratory
router.put('/laboratories/:labId', updateLaboratory);

// DELETE a laboratory
router.delete('/laboratories/:labId', deleteLaboratory);

// GET all reservations made by students
router.get('/reservations', viewAllReservations);

// PUT resolve an issue reported by a student
router.put('/issues/:issueId/resolve', resolveIssue);

module.exports = router;
