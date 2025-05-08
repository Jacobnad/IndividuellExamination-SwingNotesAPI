const Datastore = require('nedb');
const path = require('path');

// Skapa och ladda databasen för användare
const createUserDB = () => {
    return new Datastore({
        filename: path.join(__dirname, 'users.db'),
        autoload: true
    });
};

const userDB = createUserDB();

module.exports = userDB;
