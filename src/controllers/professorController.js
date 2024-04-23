const db = require('../config/db').getDb(); // Ensure this matches your actual database connection logic
const { ObjectId } = require('mongodb');
// Add a new laboratory
const addLaboratory = async (req, res) => {
    try {
        const { name, location } = req.body; // Validate and sanitize input
        const newLab = { name, location };
        const result = await db.collection('laboratories').insertOne(newLab);
        res.status(201).json({ message: "Laboratory added successfully", insertedId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update details of an existing laboratory
const updateLaboratory = async (req, res) => {
    try {
        const labId = new ObjectId(req.params.labId); // Convert the string ID to an ObjectId
        const updates = req.body; // Add input validation and sanitization here

        const result = await db.collection('laboratories').updateOne({ _id: labId }, { $set: updates });
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Laboratory not found' });
        }
        res.json({ message: 'Laboratory updated successfully' });
    } catch (error) {
        // This will catch errors like an invalid ObjectId as well as other potential errors
        res.status(500).json({ message: error.message });
    }
};

// Delete a laboratory
const deleteLaboratory = async (req, res) => {
    try {
        const labId = new ObjectId(req.params.labId); 
        const result = await db.collection('laboratories').deleteOne({ _id: labId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Laboratory not found' });
        }
        res.json({ message: 'Laboratory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View all reservations made by students
const viewAllReservations = async (req, res) => {
    try {
        const reservations = await db.collection('reservations').find({}).toArray();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resolve an issue reported by a student
const resolveIssue = async (req, res) => {
    try {
        const issueId = req.params.issueId;
        const result = await db.collection('issues').updateOne({ _id: issueId }, { $set: { status: 'Resolved' } });
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.json({ message: 'Issue resolved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

////

const deleteMachine = async (req, res) => {
    try {
        const machineIdentifier = new ObjectId(req.params.identifier); // Get the machine identifier from the request parameters
        // No need to convert to ObjectId if you use a unique identifier string for machines

        // Attempt to delete the machine
        
        const result = await db.collection('machines').deleteOne({ _id: machineIdentifier });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Machine not found or already deleted' });
        }

        res.json({ message: 'Machine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting machine: ' + error.message });
    }
};

// Add a new machine to a laboratory
const addMachine = async (req, res) => {
    try {
        const { identifier, status, operating_system, lab_id } = req.body;

        // Validation and sanitization logic should be implemented here
        // For example, check if 'identifier' is unique, 'status' is within allowed values, etc.

        // Ensure the lab_id is converted to an ObjectId
        const labObjectId = new ObjectId(lab_id);

        // Check if the laboratory exists before adding a machine to it
        const labExists = await db.collection('laboratories').findOne({ _id: labObjectId });
        if (!labExists) {
            return res.status(404).json({ message: 'Laboratory not found' });
        }

        const newMachine = {
            identifier,
            status,
            operating_system, // The 'location' field is now 'operating_system'
            lab_id: labObjectId // Use the ObjectId for the lab_id
        };

        const result = await db.collection('machines').insertOne(newMachine);
        res.status(201).json({ message: "Machine added successfully", machine: result });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            res.status(400).json({ message: "Invalid lab_id provided" });
        } else {
            res.status(500).json({ message: "here"+error.message });
        }
    }
};

const updateMachine = async (req, res) => {
    try {
        const machineId = new ObjectId(req.params.id); // Convert the string ID to an ObjectId
        let updates = req.body; // Add input validation and sanitization here
        
        // If lab_id is present in the update, convert it to an ObjectId
        if (updates.lab_id) {
            try {
                updates.lab_id = new ObjectId(updates.lab_id);
            } catch (error) {
                // If the provided lab_id isn't a valid ObjectId format, return a 400 Bad Request
                return res.status(400).json({ message: 'Invalid lab_id format' });
            }
        }
        
        const result = await db.collection('machines').updateOne({ _id: machineId }, { $set: updates });
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        
        res.json({ message: 'Machine updated successfully' });
    } catch (error) {
        // This will catch errors like an invalid ObjectId as well as other potential errors
        res.status(500).json({ message: 'Error updating machine: ' + error.message });
    }
};



module.exports = {
    addLaboratory,
    updateLaboratory,
    deleteLaboratory,
    viewAllReservations,
    resolveIssue,
    addMachine,
    deleteMachine,
    updateMachine
};
