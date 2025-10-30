const stringUtils = {
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    slugify: (str) => {
        return str
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
    },

    truncate: (str, length = 100) => {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },

    getRandomString: (length = 8) => {
        return Math.random().toString(36).substring(2, length + 2);
    }
};

module.exports = stringUtils;
