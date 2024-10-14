const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors({
    origin: process.env.MODE === "development"
        ? "*"
        : "https://people.arcada.fi"
}));

app.get("/", (req, res) => {
    console.log(req.myVar);
    res.send("<h1>Hello!!!</h1>");
});

app.use(express.json());

// Rutt för notes
const notesRouter = require("./routes/notes");
app.use("/notes", notesRouter);

// Rutt för users
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// Rutt för boards
const boardsRouter = require("./routes/boards");
app.use("/boards", boardsRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
