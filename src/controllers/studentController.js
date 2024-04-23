const db = require('../config/db').getDb(); // Ensure this matches your actual database connection logic
const { ObjectId } = require('mongodb');
// Get list of all laboratories
const getLaboratories = async (req, res) => {
    try {
        const laboratories = await db.collection('laboratories').find({}).toArray();
        res.json(laboratories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getLaboratoriesMachines = async (req, res) => {
    try {
        // First, get all laboratories
        const laboratories = await db.collection('laboratories').find({}).toArray();
        
        // Iterate over each laboratory and get its machines
        const labsWithMachines = await Promise.all(laboratories.map(async (lab) => {
            // Log the lab ID you're querying for
            console.log("Querying machines for lab ID:", lab._id);
            
            // Assuming laboratoryId in the machines collection is stored as an ObjectId
            // Ensure lab._id is an ObjectId, if not, convert it (seems you're already doing this correctly)
            const machines = await db.collection('machines').find({ lab_id: lab._id }).toArray();
            
            // Log found machines for debugging
            console.log("Found machines for lab", lab._id, machines);

            // Extract only the required fields from the machines if necessary
            const machineDetails = machines.map(machine => {
                return {_id:machine._id,name: machine.name, identifier: machine.identifier, status: machine.status,operating_system:machine.operating_system}; // Modify as needed
            });

            // Return the laboratory with its machines
            return { ...lab, machines: machineDetails };
        }));
        
        res.json(labsWithMachines);
    } catch (error) {
        console.error("Error fetching laboratories and machines:", error);
        res.status(500).json({ message: error.message });
    }
};
// View availability of machines in a specific laboratory
const viewMachineAvailability = async (req, res) => {
    try {
        const labId = req.params.labId;
        const labObjectId = new ObjectId(labId);
        const machines = await db.collection('machines').find({ lab_id: labObjectId }).toArray();
        res.json(machines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Make a new reservation
const makeReservation = async (req, res) => {
    try {
        const { machineId, startTime, endTime } = req.body; // Ensure validation and error handling
        const newReservation = {
            studentId: req.user._id, // Assuming user id is stored in req.user
            machineId,
            startTime,
            endTime,
            status: 'Reserved' // Consider validation to prevent double booking
        };
        const result = await db.collection('reservations').insertOne(newReservation);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View all reservations for the logged-in student
const viewReservations = async (req, res) => {
    try {
        const studentId = req.user._id; // Assuming user id is stored in req.user
        const reservations = await db.collection('reservations').find({ studentId }).toArray();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Report an issue with a machine
const reportIssue = async (req, res) => {
    try {
        const { machineId, description } = req.body; // Add validation and error handling
        const newIssue = {
            studentId: req.user._id, // Assuming user id is stored in req.user
            machineId,
            description,
            status: 'Open', // Default status for new issues
            reportedAt: new Date() // Timestamp for when the issue was reported
        };
        const result = await db.collection('issues').insertOne(newIssue);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getLaboratories,
    viewMachineAvailability,
    makeReservation,
    viewReservations,
    reportIssue,
    getLaboratoriesMachines
};
