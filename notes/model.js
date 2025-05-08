const Datastore = require('nedb');
const path = require('path');

// Funktion för att skapa och ladda databasen
function createDatabase() {
    const dbPath = path.join(__dirname, 'notes.db');  // Filvägen där anteckningar ska sparas
    const database = new Datastore({
        filename: dbPath,
        autoload: true  // Laddas automatiskt vid import
    });

    return database;
}


module.exports = createDatabase();
