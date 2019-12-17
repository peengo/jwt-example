const errors = {
    INVALID_CREDS: 'invalid credentials',
    USER_NOT_EXIST: 'user does not exist',
    USER_EXISTS: 'username already exists',
    USER_NOT_FOUND: 'user not found',
    POST_NOT_FOUND: 'post not found',
    INVALID_POST_FORMAT: 'invalid post format',
    INVALID_POST_ID: 'invalid post id',
    POSTS_NOT_FOUND: 'posts not found',
    TOKEN_MISSING: 'token missing',

    error(message) {
        return { error: { message } };
    },
    formatValidationErrors(validationErrors) {
        let obj = {};

        validationErrors.details.map(item => {
            obj[item.context.key] = item.message;
        });

        return { error: { validation: obj } };
    }
};

module.exports = errors;
