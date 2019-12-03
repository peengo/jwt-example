module.exports.verifyToken = async function (req, res, next) {
    const { jwt, SECRET } = req.app.locals;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'token missing' });

    try {
        const payload = await jwt.verifyAsync(token, SECRET);

        Object.assign(req.app.locals, { payload });
        next();
    } catch (error) {
        console.error(error.message);
        next(error);
    }
};

