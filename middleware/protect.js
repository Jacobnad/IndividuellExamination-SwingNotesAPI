const jwt = require('jsonwebtoken');

// Funktion för att verifiera token
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Ogiltig token'));
            } else {
                resolve(decoded);
            }
        });
    });
};

// Middleware för att skydda resurser
const protect = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Saknar token' });
    }

    const token = authHeader.split(' ')[1]; // "bearer token"

    try {
        const decoded = await verifyToken(token);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ message: error.message });
    }
};

module.exports = protect;
