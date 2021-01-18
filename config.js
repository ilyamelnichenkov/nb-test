const sourceBase = 'source';
const publicBase = 'public';

module.exports = {
    server : {watch: `${publicBase}`},
    proxy: [{
        url: '/test',
        target: 'http://localhost:8080'
    }],
    scripts: {
        input : `${sourceBase}/**/*.js`,
        output: `${publicBase}/scripts`
    },
    styles: {
        base  : `${sourceBase}/styles/style.scss`,
        input : `${sourceBase}/**/*.scss`,
        output: `${publicBase}/styles`
    },
    templates: {
        input : `${sourceBase}/templates/**/*.twig`,
        watch : `${sourceBase}/templates/**/*.twig`,
        output: `./${publicBase}`
    },
    NODE_ENV    : process.env.NODE_ENV || 'production', // or production
    isProduction: this.NODE_ENV === 'production'
};
