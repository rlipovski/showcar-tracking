module.exports.once = (fn) => {
    let executed = false;
    return () => {
        if (!executed) {
            executed = true;
            fn();
        }
    };
};
