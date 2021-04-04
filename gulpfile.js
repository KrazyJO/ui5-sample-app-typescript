const { series, parallel, src, dest } = require('gulp');
const clean = require('gulp-clean');
const babel = require("gulp-babel");
const serve = require('gulp-serve');
var browserSync = require('browser-sync').create();

const serveFolder = './serve'
const SRC = './webapp'

const copysrc = [
	`${SRC}/**/*`,
	`!${SRC}/**/*.ts`,
	`!${SRC}/**/*.tsx`,
	`!${SRC}/**/*.js`,
	`!${SRC}/resources/**/*`,
    `${SRC}/test/unit/AllTests.js`,
];

const babelFiles = [
    `${SRC}/**/*.js`,
    `${SRC}/**/*.ts`,
    `${SRC}/**/*.tsx`,
    `!${SRC}/test/unit/AllTests.js`
];

// presets: [
//     '@babel/env',
//     ["transform-ui5", {
//         "namespacePrefix": "easy.app",
//         "noImportInteropPrefixes": ["sap/", "easy/app/"],
//         "onlyConvertNamedClass": true
//     }],
//     "@babel/preset-typescript"],
// plugins: ["module:spet-ui5-jsx-rm", "@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-optional-chaining"]

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
        .pipe(babel({
            presets: [
                '@babel/env',
                ["transform-ui5", {
                    "namespacePrefix": "sap.ui.demo.todo",
                    "noImportInteropPrefixes": ["sap/", "sap/ui/demo/todo"],
                    "onlyConvertNamedClass": true
                }],
                "@babel/preset-typescript"
            ]}))
        .pipe(dest(serveFolder))
}

function serveServe(cb) {
    browserSync.init({
        server: {
            baseDir: serveFolder
        }
    });
}

exports.serve = series(cleanServe, parallel(copy, transpileAll), serveServe);
// clean serve
// copy to serve
// babel to serve
// serve serve
// livereload

