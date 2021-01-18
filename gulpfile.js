'use strict';

/**
 * DEPENDENCIES
 */
const config = require('./config');
const del = require('del');
const twig = require('gulp-twig');
const plumber = require('gulp-plumber');
const typograf = require('gulp-typograf');
const beautify = require('gulp-html-beautify');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
// const purify = require('gulp-purifycss');
// const isProd = require('./utils').isProd;
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();
const proxyMiddleware = require('http-proxy-middleware');

const isProd = process.argv.some(flag => {
    return flag === '--production'
});

/**
 * SERVER
 * @param {Stream} done
 */
function server(done) {
    const confMiddleware = config.proxy.map((proxy) => {
        return proxyMiddleware(proxy.url, {
            target      : proxy.target,
            changeOrigin: true,
            logLevel    : 'debug'
        });
    });

    browserSync.init({
        server: {
            baseDir: config.server.watch,
            middleware: confMiddleware
        },
        port: 8080,
        open: false,
        notify: false
    });
    done();
}

/**
 * Server reload
 * @param {Stream} done
 */
function reload(done) {
    browserSync.reload();
    done();
}

/**
 * CLEAN
 */
function clean() {
    return del([
        config.templates.output,
        config.styles.output
    ]);
}

/**
 * templates
 * @returns {*}
 */
function templates() {
    return gulp.src(config.templates.input)
        .pipe(plumber({
            errorHandler(err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(twig())
        .pipe(beautify({indentSize: 4}))
        .pipe(typograf({
            locale     : ['ru'],
            disableRule: ['ru/nbsp/centuries', 'common/number/fraction']
        }))
        .pipe(gulp.dest(config.templates.output));
}

/**
 * Styles
 * @returns {*}
 */
function styles() {
    return gulp.src(config.styles.base)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(config.styles.output));
}

/**
 * WATCH
 */
function watch() {
    gulp.watch(config.templates.watch, gulp.series(templates, reload));
    gulp.watch(config.styles.input, gulp.series(styles, reload));
    gulp.watch(config.scripts.output + '.js', gulp.parallel(reload));
}


function purifycss() {
    return gulp.src(`${config.styles.output}/**/*.css`)
        .pipe(gulpif(isProd, purify([`${config.templates.output}/*.html`, `${config.scripts.output}/*.js`])))
        .pipe(gulp.dest(config.styles.output));
}

gulp.task('build', gulp.series(gulp.parallel(templates, styles)));

gulp.task('dev', gulp.series(server, watch));

