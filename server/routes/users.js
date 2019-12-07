const express = require('express');
const router = express.Router();

const {
    error, formatValidationErrors,
    USER_EXISTS,
    USER_NOT_FOUND
} = require('../utils/errors');

const bcrypt = require('bcrypt');
const { verifyToken } = require('../middlewares/auth');
const { userSchema } = require('../schemas/user');
const { ObjectID } = require('mongodb');

const SALT_ROUNDS = 10;

// CREATE
router.post('/', async (req, res, next) => {
    try {
        const { users } = req.app.locals;
        const { username, password } = req.body;

        const { error: validationErrors } = userSchema.validate(
            { username, password },
            { abortEarly: false, presence: 'required' }
        );

        if (!validationErrors) {
            const user = await users.findOne({ username });
            const hash = await bcrypt.hash(password, SALT_ROUNDS);

            if (!user) {
                const insertUser = await users.insertOne({
                    username,
                    password: hash,
                    created: new Date()
                });

                if (insertUser.insertedCount) {
                    res.status(201).json({ username });
                } else {
                    next(insertUser);
                }
            } else {
                res.status(409).json(error(USER_EXISTS));
            }
        } else {
            res.status(400).json(formatValidationErrors(validationErrors));
        }
    } catch (e) {
        next(e);
    }
});

// READ SELF
router.get('/self', verifyToken, async (req, res, next) => {
    try {
        const { users, payload } = req.app.locals;
        
        const user = await users.findOne({ _id: ObjectID(payload.sub) }, { projection: { _id: 0, password: 0 } });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json(error(USER_NOT_FOUND));
        }
    } catch (e) {
        next(e);
    }
});

// READ
router.get('/:username', async (req, res, next) => {
    try {
        const { users } = req.app.locals;
        const { username } = req.params;

        const user = await users.findOne({ username }, { projection: { _id: 0, password: 0 } });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json(error(USER_NOT_FOUND));
        }
    } catch (e) {
        next(e);
    }
});

// UPDATE
router.patch('/:username', verifyToken, async (req, res, next) => {
    try {
        const { users, payload } = req.app.locals;
        const { username: usernameParam } = req.params;
        const { username, password } = req.body;

        const user = await users.findOne({ username: usernameParam });

        if (user) {
            if (user._id.toHexString() === payload.sub) {
                let updateObject = {};

                const { error: validationErrors } = userSchema.validate(
                    { username, password },
                    { abortEarly: false }
                );

                if (!validationErrors) {
                    if (username) {
                        const usernameTaken = await users.findOne({ username });

                        if (!usernameTaken) {
                            updateObject.username = username;
                        } else {
                            res.status(409).json(error(USER_EXISTS));
                        }
                    }

                    if (password) {
                        const hash = await bcrypt.hash(password, SALT_ROUNDS);

                        updateObject.password = hash;
                    }

                    if (Object.entries(updateObject).length) {
                        const updateUser = await users.updateOne({ _id: user._id }, { $set: updateObject });

                        if (updateUser.modifiedCount) {
                            res.json();
                        } else {
                            next(updateUser);
                        }
                    } else {
                        res.json();
                    }
                } else {
                    res.status(400).json(formatValidationErrors(validationErrors));
                }
            } else {
                res.status(403).json();
            }
        } else {
            res.status(404).json(error(USER_NOT_FOUND));
        }
    } catch (e) {
        next(e);
    }
});

// DELETE
router.delete('/:username', verifyToken, async (req, res, next) => {
    try {
        const { users, payload } = req.app.locals;
        const { username } = req.params;

        const user = await users.findOne({ username });

        if (user) {
            if (user._id.toHexString() === payload.sub) {
                const deleteUser = await users.deleteOne({ _id: user._id });

                if (deleteUser.deletedCount) {
                    res.status(204).json();
                } else {
                    next(deleteUser);
                }
            } else {
                res.status(403).json();
            }
        } else {
            res.status(404).json(error(USER_NOT_FOUND));
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
