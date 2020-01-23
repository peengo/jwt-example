const express = require('express');
const router = express.Router();

const {
    error, formatValidationErrors,
    INVALID_CREDS,
    USER_NOT_EXIST
} = require('../utils/errors');

const bcrypt = require('bcrypt');
const { userSchema } = require('../schemas/user');

router.post('/', async (req, res, next) => {
    try {
        const { users, jwt, SECRET } = req.app.locals;
        const { username, password } = req.body;

        const { error: validationErrors } = userSchema.validate(
            { username, password },
            { abortEarly: false, presence: 'required' }
        );

        if (!validationErrors) {
            const user = await users.findOne({ username });

            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    const token = await jwt.signAsync({ sub: user._id }, SECRET);

                    res.json({ token });
                } else {
                    res.status(400).json(error(INVALID_CREDS));
                }
            } else {
                res.status(404).json(error(USER_NOT_EXIST));
            }
        } else {
            res.status(400).json(formatValidationErrors(validationErrors));
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
