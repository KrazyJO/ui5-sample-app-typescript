const { series, parallel, watch, src, dest } = require('gulp');
const clean = require('gulp-clean');
const babel = require("gulp-babel");
var browserSync = require('browser-sync').create();

const serveFolder = './serve'
const SRC = './webapp'

const copysrc = [
	`${SRC}/**/*`,
	`!${SRC}/**/*.ts`,
	`!${SRC}/**/*.tsx`,
	`!${SRC}/**/*.js`,
	`!${SRC}/resources/**/*`
];

const babelFiles = [
    `${SRC}/**/*.js`,
    `${SRC}/**/*.ts`,
    `${SRC}/**/*.tsx`
];

const babelConfig = {
    presets: [
        '@babel/env',
        ["transform-ui5", {
            "namespacePrefix": "sap.ui.demo.todo",
            "noImportInteropPrefixes": ["sap/", "sap/ui/demo/todo"],
            "onlyConvertNamedClass": true
        }],
        "@babel/preset-typescript"
    ],
    plugins: ["module:ui5-jsx", "@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-optional-chaining"]
};

function cleanServe(cb) {
    return src(serveFolder, {read: false, allowEmpty: true})
        .pipe(clean({force: true}));
}

function copy() {
    return src(copysrc)
        .pipe(dest(serveFolder));
}

function transpileAll() {
    return src(babelFiles)
        .pipe(babel(babelConfig))
        .pipe(dest(serveFolder))
}

function serve(cb) {
    browserSync.init({
        server: {
            baseDir: serveFolder
        }
    });
}

function babelWatch() {
    watch([`${SRC}/**/*.{js,ts,tsx}`], {interval: 300})
        .on('change', function(path) {
            console.log(`babel changed: ${path}`);

            return src(path, {base: `${SRC}/`})
                .pipe(babel(babelConfig))
                .on('error', function (e) 
                {
                    console.error(e);
                    this.emit('end');
                })
                .pipe(dest(serveFolder));
        }
        );
}

function copyWatch() {
    watch([`${SRC}/**/*`, `!${SRC}/**/*.{js,ts,tsx}`], {interval: 300})
        .on('change', (path) => src(path, { base: `${SRC}/` })
            .pipe(dest(`${serveFolder}/`))
        );
}

exports.serve = series(cleanServe, parallel(copy, transpileAll), parallel(copyWatch, babelWatch, serve));
// livereload

