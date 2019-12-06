module.exports.formatValidationErrors = array => {
    let obj = {};
    
    array.map(item => {
        obj[item.context.key] = item.message;
    });

    return obj;
    // const initialValue = {};

    // return array.reduce((obj, item) => {
    //     return {
    //         ...obj,
    //         [item.context.key]: item.message
    //     };
    // }, initialValue);
};
