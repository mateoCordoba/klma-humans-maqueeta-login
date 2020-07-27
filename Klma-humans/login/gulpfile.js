var gulp = require('gulp');
var sass = require('gulp-sass');
//var browserSync = require('browser-sync').create();
var connect = require('gulp-connect');
//var reload = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');
//var browserify = require('browserify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
//var uglify = require("gulp-uglify");
//var cleanCss = require("gulp-clean-css");
var concat = require("gulp-concat");
var imagemin = require("gulp-imagemin");

var browserToFix = [
    '> 1%',
    'ie >= 8',
    'edge >= 15',
    'ie_mob >= 10',
    'ff >= 45',
    'chrome >= 45',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];


var onError = async(err)=>{
    console.log("Se ha producido un error: ", err.message);
    this.emit("end");
}


//var fontsSRC = './src/fonts/**/*.*';
//var fontsURL = './app/fonts/' ;

//var htmlSRC = './src/**/*.html'; // en esta variable guardamos todos los recursos HTML contenido en la ruta especificada 
//var htmlURL = './app/';


var styleSRC =  "./gulp-src/sass/style.scss";  // en esta variable guardamos todos recursos los estilo ./src/scss
var styleURL =  './css'; //En esta variable se almacena la ruta al archivo css de la ./app

var jsSRC = './gulp-src/js/**/*.*';  // en esta variable guardamos todos los recursos estilo JS
var jsURL = './js/';

var imgSRC = './gulp-src/img/**/*.*';
var imgURL = './img/';

var styleWatch = './gulp-src/sass/**/*.scss'
var jsWatch = './gulp-src/js/**/*.js';
var htmlWatch = './gulp-src/**/*.html';
var fontsWatch = './gulp-src/fonts/**/*.*';
var imgWatch = './gulp-src/img/**/*.*';

var mapURL = './';


gulp.task('css', async ()=>{
    // Esta taréa carga en los archivos de estilo "css" de la carptea "app" todo los cambios realizados en el scss/app.scss
    gulp.src(styleSRC)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole:  true,
            outputStyle:"compressed" // este atributo de la funcion sass nos minifica el archivo 
        })
        .on('error',sass.logError))
        .pipe(autoprefixer({
            browse:browserToFix,
            cascade: false
        }))
        .pipe(rename({suffix: '.min'})) // en esta linea indicamos que cuando se transfiera el archivo desde src hacia app se 
                                        //transferirá con el nombre del archivo como tal con contrar la extenión tterminando en ".min"
                                        // pero NO minifica el archo (esto se hace con el atributo "outputStyle:'compressed')" de la funcion sass
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(styleURL)).on('error',console.log.bind(console))
        //.pipe(browserSync.stream())

});


//gulp.task("lint", function(){
//    return gulp.src("./js/custom/**/*.js")
//            .pipe(jshint())
//});

gulp.task("js", async()=>{
    gulp.src(jsSRC)
    .pipe(concat("all.js"))
    .pipe(rename({suffix:'.min'} ))
    .pipe(gulp.dest(jsURL))
    //.pipe(livereload())
    .pipe(notify({message: "JavaScript task finalizada"}))
});


// Este comando minifica las imágenes
//gulp.task("img", async()=>{
//    return gulp.src(imgSRC)
//            .pipe(plumber({errorHandler:onError}))
//            .pipe(imagemin({
//                progessive: true,
//                interlaced: true
//            }))
//            .pipe(gulp.dest(imgURL))
//            .pipe(notify({message: "Imagemin task finalizada"}))
//});

gulp.task('serve',async ()=>{
    //  esta gulp task:"serve" ejecuta la función "sass"  antes que todo
    console.log ("entro en serve");
    connect.server({
        root:'./app/',
        port:8082,
        livereload:true           
    });
       
});

gulp.task('watchFiles', async ()=>{
    gulp.watch(styleWatch, gulp.series( 'css'));
    //gulp.watch(htmlWatch,gulp.series('html'));
    //gulp.watch(imgWatch, gulp.series('img'));
    //gulp.watch(fontsWatch, gulp.series('fonts'));
    gulp.watch(jsWatch, gulp.series('js'));
    gulp.src(jsURL+'all.min.js',connect.reload())
        .pipe(notify({message:'gulp is watching, happy conding'}))    
        
});

// Primero corremos la tearea "build" para evitar errores al correr la tarea "defauilt"
gulp.task('build',gulp.parallel('css','js',/*'html', 'fonts', 'img'*/));

gulp.task('default', gulp.series('build','serve','watchFiles')); 

    
