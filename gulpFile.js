const gulp = require('gulp');
const cache = require('gulp-cache');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

const sassTask = (done) => {
    //loads file in memory 
    gulp.src('./scss/main.scss')
        .pipe(cache('sass'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./hosted'));

    done();
}//sass task

const jsTask = (done) => {
    gulp.src(['./client.js', './client/*.jsx'])//will load all js files within client.js
    .pipe(cache('babel'))
    .pipe(babel({
        presets: ['@babel/preset-env', '@babel/preset-react']
    }))
    .pipe(gulp.dest('./hosted/'));

    done();
};//js task

const eslintTask = (done) => {
    gulp.src('./server/*.js')
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

        done();
};//eslint tast


const watch = () => {
    //any time theres a change, want to run the sasstask
    gulp.watch('./scss/main.scss', sassTask);
    gulp.watch(['./client/*.js', './client/*.jsx'], jsTask);

    nodemon({
        script: './server/app.js',
        ignore: ['client/', 'scss/', 'node_modules/'],
        ext: 'js html css'
      });
}; //watch

//will run these all at the same time w/ parallel
module.exports.build = gulp.parallel(sassTask, jsTask, eslintTask);