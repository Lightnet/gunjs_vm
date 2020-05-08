const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';
const prod = mode === 'production';
var started = false;
var server = null;

const path                              = require('path');
const fs                                = require('fs');
var gulp                                = require('gulp');
const webpack                           = require('webpack-stream');
const { src, dest, series  }            = require('gulp');

const { join }                          = require('path');
const { VueLoaderPlugin }               = require('vue-loader');
const { HotModuleReplacementPlugin }    = require('webpack');
const HTMLWebpackPlugin                 = require('html-webpack-plugin');
var nodemon                             = require('gulp-nodemon');

var front_webpack = {
    //watch: true,
    mode:"development",
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }, {
                test: /.vue$/, 
                loader: 'vue-loader'
            },
            {
                test: /\.css$/, 
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new HTMLWebpackPlugin({
            showErrors: true,
            cache: true,
            template: join(__dirname, 'index.html')
        })
    ]
}

function front_build(done) {
    return src('client.js')
    .pipe(webpack(front_webpack))
    .pipe(dest('public/'));
}
exports.front_build = front_build;

function watch(done) {
    //gulp.watch(['./src/client/*.js','./src/client/*.vue'], gulp.series( build));
    gulp.watch(['./*.js','./*.vue'], gulp.series( front_build));
    //gulp.watch(['./app.js'], gulp.series(build));
    //gulp.watch(['src/client/*.html'], gulp.series( copy_html));
    return done();
};

exports.watch = watch;

function serve(done){
    var stream = nodemon({
        //nodemon: require('nodemon'),
        script: 'app.js',
        //watch:['src/client'],
        //watch:['public/'],
        ext: 'js',
        ignore: ['gulpfile.js','webpack.config.js','node_modules/','data/'],
        //tasks: ['cleanscript'],
        done: done,
	}).on('start', function () {
        //console.log('===================================');
        //console.log('started!');
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			done();
			started = true; 
        } 
        //console.log('started END=========!');
    }).on('restart', function () {
        //console.log('===================================');
        //console.log('restarted!');
        //cleanscript();
    }).on('crash', function() {
        //console.log('===================================');
        //console.error('Application has crashed!\n');
        stream.emit('restart', 5);  // restart the server in 5 seconds
    });
    return stream;
}
exports.serve = serve;

exports.build = series(front_build)

exports.default = series(front_build,watch,serve)