const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');
const { postSchema } = require('../schemas/post');
const { ObjectID } = require('mongodb');

// CREATE
router.post('/', verifyToken, async (req, res, next) => {
    try {
        const { users, posts, payload } = req.app.locals;
        const { title, body } = req.body;

        const user = await users.findOne({ _id: ObjectID(payload.sub) });

        if (user) {
            const { error: validationErrors } = postSchema.validate(
                { title, body },
                { abortEarly: false, presence: 'required' }
            );

            if (!validationErrors) {
                const insertPost = await posts.insertOne({
                    title,
                    body,
                    created: new Date(),
                    user_id: user._id
                });

                if (insertPost.insertedCount) {
                    res.status(201).json({ _id: insertPost.insertedId });
                } else {
                    next(insertPost);
                }
            } else {
                console.error(validationErrors);
                res.status(400).json({ error: { validation: validationErrors.details } });
            }
        } else {
            res.status(404).json({ error: 'user not found' });
        }
    } catch (e) {
        next(e);
    }
});

//READ
router.get('/:id', async (req, res, next) => {
    try {
        const { users, posts } = req.app.locals;
        const { id } = req.params;

        if (ObjectID.isValid(id)) {
            const post = await posts.findOne({ _id: ObjectID(id) });

            if (post) {
                const user = await users.findOne({ _id: post.user_id });

                if (user) {
                    delete post._id;
                    delete post.user_id;
                    post.author = user.username;

                    res.json(post);
                } else {
                    res.status(404).json({ error: 'user not found' });
                }
            } else {
                res.status(404).json({ error: 'post not found' });
            }
        } else {
            res.status(400).json({ error: 'invalid post format' });
        }
    } catch (e) {
        next(e);
    }
});

// UPDATE
router.patch('/:id', verifyToken, async (req, res, next) => {
    try {
        const { posts, payload } = req.app.locals;
        const { id } = req.params;
        const { title, body } = req.body;

        if (ObjectID.isValid(id)) {
            const post = await posts.findOne({ _id: ObjectID(id) });

            if (post) {
                if (post.user_id.toHexString() === payload.sub) {

                    let updateObject = {};

                    const { error: validationErrors } = postSchema.validate(
                        { title, body },
                        { abortEarly: false }
                    );

                    if (!validationErrors) {
                        if (title) updateObject.title = title;
                        if (body) updateObject.body = body;

                        if (Object.entries(updateObject).length) {
                            const updatePost = await posts.updateOne({ _id: post._id }, { $set: updateObject });

                            if (updatePost.modifiedCount) {
                                res.json();
                            } else {
                                next(updatePost);
                            }
                        } else {
                            res.json();
                        }
                    } else {
                        console.error(validationErrors);
                        res.status(400).json({ error: { validation: validationErrors.details } });
                    }
                } else {
                    res.status(403).json();
                }
            } else {
                res.status(404).json({ error: 'post not found' });
            }
        } else {
            res.status(400).json({ error: 'invalid post id' });
        }
    } catch (e) {
        next(e);
    }
});

// DELETE
router.delete('/:id', verifyToken, async (req, res, next) => {
    try {
        const { posts, payload } = req.app.locals;
        const { id } = req.params;

        if (ObjectID.isValid(id)) {
            const post = await posts.findOne({ _id: ObjectID(id) });

            if (post) {
                if (post.user_id.toHexString() === payload.sub) {
                    const deletePost = await posts.deleteOne({ _id: ObjectID(id) });

                    if (deletePost.deletedCount) {
                        res.status(204).json();
                    } else {
                        next(deletePost);
                    }
                } else {
                    res.status(403).json();
                }
            } else {
                res.status(404).json({ error: 'post not found' });
            }
        } else {
            res.status(400).json({ error: 'invalid post format' });
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
