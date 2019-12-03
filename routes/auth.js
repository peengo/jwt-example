const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { userSchema } = require('../schemas/user');

router.post('/', async (req, res, next) => {
    try {
        const { users, jwt, SECRET } = req.app.locals;
        const { username, password } = req.body;

        const { error: validationErrors } = userSchema.validate(
            { username, password },
            { abortEarly: false }
        );

        if (!validationErrors) {
            const user = await users.findOne({ username });

            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    const token = await jwt.signAsync({ sub: user._id }, SECRET);

                    res.json({ token });
                } else {
                    res.json({ error: 'invalid credentials' });
                }
            } else {
                res.status(404).json({ error: 'user does not exist' });
            }
        } else {
            console.error(validationErrors);
            res.status(400).json({ error: { validation: validationErrors.details } });
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
