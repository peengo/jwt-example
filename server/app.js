const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const { promisify } = require('util');

jwt.signAsync = promisify(jwt.sign);
jwt.verifyAsync = promisify(jwt.verify);

require('dotenv').config();
const { PORT, MONGO_URL, SECRET } = process.env;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/auth', require('./routes/auth'));

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    // const error = new Error('API route not found');

    // error.status = 404;
    // next(error);

    console.error(`${req.method} ${req.path} route not found`);
    res.status(404).json({ error: 'API route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    // res.status(error.status || 500);
    // res.json({ error: error.message });

    console.error(error);

    if (error instanceof SyntaxError && error.status === 400 && error.message.includes('JSON')) {
        res.status(400).json({ error: 'JSON error' });
    } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(400).json({ error: 'token error' });
    }
    else {
        res.status(500).json();
    }
});

(async () => {
    try {
        console.log('Connecting to MongoDB ...');
        const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

        if (client.isConnected()) console.log('MongoDB Connected');

        const db = client.db();
        const users = db.collection('users');
        const posts = db.collection('posts');

        Object.assign(app.locals, { users, posts, jwt, SECRET });

        app.listen(PORT, () => console.log(`API listening on port ${PORT}!`));
    } catch (error) {
        console.error(error);
    }
})();
