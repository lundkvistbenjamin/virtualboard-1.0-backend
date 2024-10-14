const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authorize = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Få alla notes för en specifik board
router.get("/:boardId", authorize, async (req, res) => {
    const { boardId } = req.params;

    try {
        const notes = await prisma.notes.findMany({
            where: {
                boardId: boardId
            },
        });
        res.send(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error retrieving notes" });
    }
});

// Skapa note för en specifik board
router.post("/:boardId", authorize, async (req, res) => {
    const { boardId } = req.params;

    try {
        const newNote = await prisma.notes.create({
            data: {
                boardId: boardId,
                content: req.body.content,
                positionX: req.body.positionX,
                positionY: req.body.positionY,
                color: req.body.color
            },
        });

        res.status(201).send({ msg: "New note created!", note: newNote });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error creating note" });
    }
});

// Uppdatera note
router.put("/:boardId/:id", authorize, async (req, res) => {
    const { id, boardId } = req.params;

    try {
        const updateData = {};
        // Uppdaterar om content inte är undefined
        if (req.body.content !== undefined) updateData.content = req.body.content;
        if (req.body.positionX !== undefined) updateData.positionX = req.body.positionX;
        if (req.body.positionY !== undefined) updateData.positionY = req.body.positionY;
        if (req.body.color !== undefined) updateData.color = req.body.color;

        const updatedNote = await prisma.notes.update({
            where: { id: id },
            data: updateData
        });

        res.send({ msg: `Note ${id} updated`, note: updatedNote });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error updating note" });
    }
});

// Ta bort note
router.delete("/:boardId/:id", authorize, async (req, res) => {
    const { id, boardId } = req.params;

    try {
        await prisma.notes.delete({
            where: { id: id }
        });
        res.send({ msg: "Note deleted!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error deleting note" });
    }
});

module.exports = router;
