const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authorize = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Skapa ny board
router.post("/", authorize, async (req, res) => {
    try {
        const newBoard = await prisma.boards.create({
            data: {
                userId: req.userData.sub,
                title: req.body.title
            },
        });
        res.status(201).send({ msg: "New board created!", board: newBoard });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error creating board" });
    }
});

// Få alla boards för användaren
router.get("/", authorize, async (req, res) => {
    try {
        const boards = await prisma.boards.findMany({
            where: { userId: req.userData.sub }
        });
        res.send(boards);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error retrieving boards" });
    }
});

const notesRouter = require("./notes");
router.use("/:boardId", notesRouter);

module.exports = router;
