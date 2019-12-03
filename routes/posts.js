const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');
const { postSchema/*, titleConstraint, bodyConstraint*/ } = require('../schemas/post');
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
                { abortEarly: false }
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
            res.status(400).json({ error: 'invalid post id format' });
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
            res.status(400).json({ error: 'invalid post id format' });
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
