const express = require('express');
const cors = require('cors');
const checkName = require('./middleware/check-name');
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

// Behövs för att vi ska kunna ta emot JSON i request bodyn:
app.use(express.json());

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});