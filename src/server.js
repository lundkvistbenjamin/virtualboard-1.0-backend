const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors({
    origin: process.env.MODE === "development"
        ? "*"
        : "https://people.arcada.fi"
}));

app.get('/', (req, res) => {
    console.log(req.myVar);
    res.send("<h1>Hello!! cors?</h1>");
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route for notes
const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);

// Route for users
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// Route for boards
const boardsRouter = require('./routes/boards');
app.use('/boards', boardsRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
