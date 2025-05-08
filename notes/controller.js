const notesDB = require('./model');
const { v4: uuidv4 } = require('uuid');

// Validering av titel och text
const validateNoteInput = (title, text) => {
    if (!title || !text || title.length > 50 || text.length > 300) {
        return { valid: false, message: 'Ogiltig titel eller text' };
    }
    return { valid: true };
};

// Skapar en anteckning
const createNote = (req, res) => {
    const { title, text } = req.body;

    const validation = validateNoteInput(title, text);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const newNote = {
        id: uuidv4(),
        title,
        text,
        createdAt: new Date(),
        modifiedAt: new Date(),
        userId: req.userId
    };

    notesDB.insert(newNote, (err, savedNote) => {
        if (err) {
            return res.status(500).json({ message: 'Kunde inte spara anteckningen' });
        }
        res.status(201).json(savedNote);
    });
};

// Hämtar anteckningar
const getNotes = (req, res) => {
    notesDB.find({ userId: req.userId }, (err, notes) => {
        if (err) {
            return res.status(500).json({ message: 'Kunde inte hämta anteckningar' });
        }
        res.status(200).json(notes);
    });
};

// Uppdaterar anteckning
const updateNote = (req, res) => {
    const { id, title, text } = req.body;

    const validation = validateNoteInput(title, text);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    notesDB.update(
        { id, userId: req.userId },
        { $set: { title, text, modifiedAt: new Date() } },
        {},
        (err, numReplaced) => {
            if (err) {
                return res.status(500).json({ message: 'Kunde inte uppdatera anteckningen' });
            }
            if (numReplaced === 0) {
                return res.status(404).json({ message: 'Anteckningen hittades inte' });
            }
            res.status(200).json({ message: 'Anteckningen har uppdaterats' });
        }
    );
};

// Tar bort anteckning
const deleteNote = (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Saknar antecknings-ID' });
    }

    notesDB.remove({ id, userId: req.userId }, {}, (err, numRemoved) => {
        if (err) {
            return res.status(500).json({ message: 'Kunde inte ta bort anteckningen' });
        }
        if (numRemoved === 0) {
            return res.status(404).json({ message: 'Anteckningen hittades inte' });
        }
        res.status(200).json({ message: 'Anteckningen har tagits bort' });
    });
};

module.exports = {
    createNote,
    getNotes,
    updateNote,
    deleteNote
};
