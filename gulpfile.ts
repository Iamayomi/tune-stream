import * as gulp from "gulp";


// Task to copy files from public folder
 function copyPublic() {
  return gulp.src("src/public/**/*.*").pipe(gulp.dest("dist/src/public"));
};

// Task to copy files from views folder
function copyViews () {
  return gulp.src("src/views/**/*.*").pipe(gulp.dest("dist/src/views"));
};

// Default task

export const build = gulp.series(copyPublic, copyViews);