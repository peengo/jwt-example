const express = require('express');
const router = express.Router();

const {
    error, formatValidationErrors,
    USER_NOT_FOUND,
    POST_NOT_FOUND,
    INVALID_POST_FORMAT,
    INVALID_POST_ID,
    POSTS_NOT_FOUND
} = require('../utils/errors');

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
                res.status(400).json(formatValidationErrors(validationErrors));
            }
        } else {
            res.status(404).json(error(USER_NOT_FOUND));
        }
    } catch (e) {
        next(e);
    }
});

//READ
router.get('/:id', async (req, res, next) => {
    try {
        const { posts } = req.app.locals;
        const { id } = req.params;

        if (ObjectID.isValid(id)) {
            let [post] = await posts.aggregate([
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $match: { _id: ObjectID(id) } },
                { $project: { user_id: 0, user: { password: 0, created: 0 } } }
            ]).toArray();

            if (post) {
                res.json(post);
            } else {
                res.status(404).json(error(POST_NOT_FOUND));
            }
        } else {
            res.status(400).json(error(INVALID_POST_FORMAT));
        }
    } catch (e) {
        next(e);
    }
});

// READ ALL
router.get('/', async (req, res, next) => {
    try {
        const { posts } = req.app.locals;

        let postsAll = await posts.aggregate([
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $sort: { created: -1 } },
            { $project: { user_id: 0, user: { password: 0, created: 0 } } }
        ]).toArray();

        if (postsAll) {
            res.json(postsAll);
        } else {
            res.status(404).json(error(POSTS_NOT_FOUND));
        }
    } catch (e) {
        next(e);
    }
});

// READ ALL FROM USER
router.get('/user/:username', async (req, res, next) => {
    try {
        const { posts, users } = req.app.locals;
        const { username } = req.params;

        const user = await users.findOne({ username }, { projection: { password: 0 } });

        if (user) {
            let postsUser = await posts.find({ user_id: ObjectID(user._id) }).toArray();

            if (postsUser) {
                res.json(postsUser);
            } else {
                res.status(404).json(error(POSTS_NOT_FOUND));
            }
        } else {
            res.status(404).json(error(USER_NOT_FOUND));
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
                        res.status(400).json(formatValidationErrors(validationErrors));
                    }
                } else {
                    res.status(403).json();
                }
            } else {
                res.status(404).json(error(POST_NOT_FOUND));
            }
        } else {
            res.status(400).json(error(INVALID_POST_ID));
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
                res.status(404).json(error(POST_NOT_FOUND));
            }
        } else {
            res.status(400).json(error(POST_NOT_FOUND));
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
