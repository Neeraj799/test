const express = require("express");
const mongoose = require("mongoose");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');

app.use(express.json());

mongoose.connect(`mongodb + srv://neerajpc799:12345671@cluster0.jrnubv7.mongodb.net/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/register',
    [
        body('username').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({ username, email, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                })
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }

    });

app.post(
    '/login',
    [
        body('email').isEmail(),
        body('password').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid credentials" })
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                })
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }

    });

app.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No Token Provided' });
    }


    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
