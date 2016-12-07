/**
 * Created by mohammad.maleh on 9/24/2016.
 */

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    jscs = require('gulp-jscs'),
    concat = require('gulp-concat'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-clean-css'),
    notify = require('gulp-notify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    runSequence = require('run-sequence'),
    gulpif = require('gulp-if'),
    argv = require('yargs').argv,
    template = require('gulp-template');

var filePath = {
    build: {
        dest: './public'
    },

    browserify: {
        src: './app/app.js',
        watch: [

            './app/**/*.js',
            '/app/**/*.html'
        ]
    },

    styles: {
        src: './app/app.less',
        watch: ['./app/**/*.less', '!./app/assets/**/*.less']
    },
    stylesLess: {
        src: './app/assets/less/vendor.less',
        watch: ['./app/assets/less/vendor.less', './app/assets/**/*.less']
    },
    assets: {
        images: {
            src: './app/assets/images/**/*',
            watch: ['./app/assets/images', './app/assets/images/**/*'],
            dest: './public/images/'
        },
        fonts: {
            src: ['./app/assets/fonts/*'],
            dest: './public/fonts/'
        }
    },
    vendorJS: {
        src: []
    },
    vendorCSS: {
        src: [
            './node_modules/animate.css/animate.css',
            // './node_modules/bootstrap/dist/css/bootstrap.css',
            // './node_modules/font-awesome/css/font-awesome.css'
        ]
    },
    copyIndex: {
        src: './app/index.html',
        watch: './app/index.html'
    },
    copyFavicon: {
        src: './app/favicon.png'
    },
    copyWebConfig: {
        src: './Web.config'
    },
    envEndPoint: {
        src: './app/common/constants/constant_temp/CONSTANTS.js',
        dest: './app/common/constants/'
    }
};

// =======================================================================
// Error Handling
// =======================================================================
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}
// =======================================================================
// Clean out public folder contents on build
// =======================================================================
gulp.task('clean-dev', function () {
    del(['./public/*.js',
        './public/*.css',
        '!./public/vendor.js',
        '!./public/vendor.css',
        './public/*.html',
        '!./public/images/**/*',
        './public/*.ico',
        './reports/**/*',
        './reports']);
});

gulp.task('clean-full', function () {
    del(['./public/*',
        './coverage/**/*',
        './coverage']);
});



// =======================================================================
// Browserify Bundle
// =======================================================================

var bundle = {};
bundle.conf = {
    entries: filePath.browserify.src,
    external: filePath.vendorJS.src,
    debug: true,
    cache: {},
    packageCache: {}
};


function rebundle() {
    console.log("rebundled --> "+ new Date().toLocaleTimeString());
    return bundle.bundler.bundle()
        .pipe(source('bundle.js'))
        .on('error', handleError)
        .pipe(buffer())
        .pipe(gulpif(!bundle.prod, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(gulpif(!bundle.prod, sourcemaps.write('./')))
        .pipe(gulpif(bundle.prod, streamify(uglify({
            mangle: false
        }))))
        .pipe(gulp.dest(filePath.build.dest))
        .pipe(connect.reload());
}

function configureBundle(prod) {

    bundle.bundler = watchify(browserify(bundle.conf));
    bundle.bundler.on('update', rebundle);
    bundle.prod = prod;
}

gulp.task('bundle-dev', function () {
    'use strict';
    configureBundle(false);
    return rebundle();
});
gulp.task('config-template', function () {
    return gulp.src(filePath.envEndPoint.src)

        .pipe(gulp.dest(filePath.envEndPoint.dest))
        .pipe(notify({
            message: 'config-template successfully finished'
        }))
        .pipe(connect.reload());
});

// =======================================================================
// Styles Task
// =======================================================================
gulp.task('styles-dev', function () {
    return gulp.src(filePath.styles.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', handleError)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(filePath.build.dest))
        .on('error', handleError)
        .pipe(notify({
            message: 'styles-dev task complete'
        }))
        .pipe(connect.reload());
});
gulp.task('styles-vendor', function () {
    return gulp.src(filePath.stylesLess.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', handleError)
        .pipe(sourcemaps.write())
        .pipe(minifyCSS())
        .pipe(gulp.dest(filePath.build.dest))
        .on('error', handleError)
        .pipe(notify({
            message: 'styles-less-dev task complete'
        }))
        .pipe(connect.reload());
});

gulp.task('styles-prod', function () {
    return gulp.src(filePath.styles.src)
        .pipe(less())
        .on('error', handleError)
        .pipe(prefix('last 1 version', '> 1%', 'ie 8', 'ie 7', {
            map: true
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(filePath.build.dest))
        .on('error', handleError)
        .pipe(notify({
            message: 'styles-prod task complete'
        }));
});
gulp.task('styles-vendor-prod', function () {
    return gulp.src(filePath.stylesLess.src)
        .pipe(less())
        .on('error', handleError)
        .pipe(prefix('last 1 version', '> 1%', 'ie 8', 'ie 7', {
            map: true
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(filePath.build.dest))
        .on('error', handleError)
        .pipe(notify({
            message: 'styles-vendor-prod task complete'
        }));
});



// =======================================================================
// Images Task
// =======================================================================
gulp.task('images', function () {
    return gulp.src(filePath.assets.images.src)
        .on('error', handleError)
        .pipe(gulp.dest(filePath.assets.images.dest))
        .pipe(connect.reload());
});

// =======================================================================
// Fonts Task
// =======================================================================
gulp.task('fonts', function () {
    return gulp.src(filePath.assets.fonts.src)
        .on('error', handleError)
        .pipe(gulp.dest(filePath.assets.fonts.dest))
        .pipe(connect.reload());
});

// =======================================================================
// Vendor JS Task
// =======================================================================
gulp.task('vendorJS', function () {
    var b = browserify({
        debug: true,
        require: filePath.vendorJS.src
    });

    return b.bundle()
        .pipe(source('vendor.js'))
        .on('error', handleError)
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(filePath.build.dest))
        .pipe(notify({
            message: 'VendorJS task complete'
        }));
});

// =======================================================================
// Vendor CSS Task
// =======================================================================

// =======================================================================
// Vendor CSS Task
// =======================================================================
gulp.task('vendorCSS', function () {
    return gulp.src(filePath.vendorCSS.src)
        .pipe(concat('vendor.css'))
        .on('error', handleError)
        .pipe(minifyCSS())
        .pipe(gulp.dest(filePath.build.dest))
        .pipe(notify({
            message: 'VendorCSS task complete'
        }))
        .pipe(connect.reload());
});

// =======================================================================
// Copy index.html
// =======================================================================
gulp.task('copyIndex', function () {
    return gulp.src(filePath.copyIndex.src)
        .pipe(template({buildNumber: argv.buildNumber || false}))
        .pipe(gulp.dest(filePath.build.dest))
        .pipe(notify({
            message: 'index.html successfully copied'
        }))
        .pipe(connect.reload());
});


// =======================================================================
// Watch for changes
// =======================================================================
gulp.task('watch', function () {
    gulp.watch(filePath.styles.watch, ['styles-dev']);
    gulp.watch(filePath.stylesLess.watch, ['styles-vendor']);
    gulp.watch(filePath.assets.images.watch, ['images']);
    gulp.watch(filePath.vendorJS.src, ['vendorJS']);
    gulp.watch(filePath.vendorCSS.src, ['vendorCSS']);
    gulp.watch(filePath.copyIndex.watch, ['copyIndex']);
    // gulp.watch(filePath.lint.src, ['lint']);
    console.log('Watching...');
});



// run "gulp build" in terminal for a full re-build in DEV
gulp.task('build', function (callback) {
    runSequence(
        ['clean-full','config-template'],
        ['bundle-dev', 'styles-dev', 'images', 'fonts', 'vendorJS','vendorCSS', 'copyIndex', 'styles-vendor'],
        ['watch'],
        callback
    );
});
gulp.task('check', function () {
    'use strict';
    return browserify(bundle.conf).on('error', handleError).bundle().on('error', handleError);
});





