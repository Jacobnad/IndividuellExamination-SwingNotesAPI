const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDB = require('./model');

// Funktion för att kontrollera om användarnamn och lösenord finns
const validateUserInput = (username, password) => {
    if (!username || !password) {
        return { valid: false, message: 'Användarnamn och lösenord krävs' };
    }
    return { valid: true };
};

// Funktion för att skapa en användare
const createUser = async (username, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
        username,
        password: hashedPassword
    };

    return new Promise((resolve, reject) => {
        userDB.insert(newUser, (err, createdUser) => {
            if (err) return reject(new Error('Fel vid sparning av användare'));
            resolve(createdUser);
        });
    });
};

// Registrering av användare
const signup = async (req, res) => {
    const { username, password } = req.body;

    const validation = validateUserInput(username, password);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        // Kolla om användaren redan finns
        const user = await new Promise((resolve, reject) => {
            userDB.findOne({ username }, (err, user) => {
                if (err) return reject(err);
                resolve(user);
            });
        });

        if (user) {
            return res.status(400).json({ message: 'Användaren finns redan' });
        }

        // Skapa en ny användare
        await createUser(username, password);
        res.status(201).json({ message: 'Användare skapades' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Funktion för att logga in en användare
const login = async (req, res) => {
    const { username, password } = req.body;

    const validation = validateUserInput(username, password);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        // Hitta användaren
        const user = await new Promise((resolve, reject) => {
            userDB.findOne({ username }, (err, user) => {
                if (err) return reject(err);
                resolve(user);
            });
        });

        if (!user) {
            return res.status(404).json({ message: 'Användaren hittades inte' });
        }

        // Kontrollera lösenordet
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Ogiltiga inloggningsuppgifter' });
        }

        // Skapa och skicka JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login };
