const { MongoClient } = require('mongodb');

// Connection URL and Database Name
const url = 'mongodb://127.0.0.1:27017'; // MongoDB URI 
const dbName = 'labmanagerdb'; //database name

let db = null;

// Connect to the database
async function connect() {
    try {
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected successfully to MongoDB");

        // Select the database through the connection
        db = client.db(dbName);
    } catch (err) {
        console.error('Could not connect to MongoDB', err);
        process.exit(1); // Exit process if cannot connect
    }
}

// Retrieves the database object to use in other files
function getDb() {
    if (!db) {
        throw new Error('No database connection. Please call connect first!');
    }
    return db;
}

module.exports = { connect, getDb };
