const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authorize = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Skapa användare med 5 default boards
router.post('/', async (req, res) => {
    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        // Skapa användare
        const newUser = await prisma.user.create({
            data: {
                name: req.body.name,
                password: hashedPassword
            }
        });

        // Skapa 3 boards i boards endpoint
        const boards = [];
        for (let i = 1; i <= 3; i++) {
            boards.push({
                title: `Tavla ${i}`,
                userId: newUser.id
            });
        }

        // Spara boards i databasen
        await prisma.boards.createMany({
            data: boards
        });

        res.send({ msg: "Användare skapad." });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ msg: "Något gick fel, försök igen." });
    }
});

// Logga in med användarnamn och lösenord
router.post('/login', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { name: req.body.name }
    });

    if (user == null) {
        console.log("BAD USERNAME");
        return res.status(401).send({ msg: "Authentication failed" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
        console.log("BAD PASSWORD");
        return res.status(401).send({ msg: "Authentication failed" });
    }

    const token = await jwt.sign({
        sub: user.id,
        name: user.name,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.send({ msg: "Login OK", jwt: token });
});

// Endpoint för att verifiera jwt token
router.get('/verify-token', authorize, (req, res) => {
    res.status(200).json({
        msg: "Token is valid",
        user: req.userData
    });
});

module.exports = router;