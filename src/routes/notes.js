const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authorize = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all notes for a specific board
router.get('/:boardId', authorize, async (req, res) => {
    const { boardId } = req.params; // Get boardId from the URL
    console.log(`Fetching notes for board ID: ${boardId}`);
    try {
        const notes = await prisma.notes.findMany({
            where: {
                boardId: boardId, // Ensure you're getting notes for the specific board
            },
        });
        res.send(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error retrieving notes" });
    }
});


// Create a new note for a specific board
router.post('/:boardId', authorize, async (req, res) => {
    const { boardId } = req.params; // Get boardId from the URL
    console.log(`Creating note for board ID: ${boardId}`);
    console.log(req.body);

    try {
        const newNote = await prisma.notes.create({
            data: {
                boardId: boardId, // Set the boardId for the new note
                content: req.body.content, // Use content from request body
                position: req.body.position,
                color: req.body.color,
            },
        });

        res.status(201).send({ msg: "New note created!", note: newNote });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error creating note" });
    }
});

// Update a specific note for a specific board
router.put('/:boardId/:id', authorize, async (req, res) => {
    const { id, boardId } = req.params; // Get boardId and note id from the URL
    console.log(`Updating note ID: ${id} for board ID: ${boardId}`);

    try {
        const updatedNote = await prisma.notes.update({
            where: { id: id },
            data: {
                content: req.body.content,
                position: req.body.position,
                color: req.body.color,
            },
        });
        res.send({ msg: `Note ${id} updated`, note: updatedNote });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error updating note" });
    }
});

// Delete a specific note for a specific board
router.delete('/:boardId/:id', authorize, async (req, res) => {
    const { id, boardId } = req.params; // Get boardId and note id from the URL
    console.log(`Deleting note ID: ${id} for board ID: ${boardId}`);

    try {
        await prisma.notes.delete({
            where: { id: id },
        });
        res.send({ msg: "Note deleted!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Error deleting note" });
    }
});

module.exports = router;
