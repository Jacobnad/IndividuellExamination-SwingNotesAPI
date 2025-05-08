require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const userController = require('./users/controller');
const noteController = require('./notes/controller');
const protect = require('./middleware/protect');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();
app.use(express.json());

// ====== Användarrutter ======
app.post('/api/user/signup', userController.signup);
app.post('/api/user/login', userController.login);

// ====== Notes-rutter (skyddade) ======
app.route('/api/notes')
    .post(protect, noteController.createNote)
    .get(protect, noteController.getNotes)
    .put(protect, noteController.updateNote)
    .delete(protect, noteController.deleteNote);

// ====== Swagger-dokumentation ======
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ====== Test-rutt ======
app.get('/', (req, res) => {
    res.send('Swing Notes API is running!');
});

// ====== Starta servern ======
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
});
