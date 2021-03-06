const gulp =        require( 'gulp' ),
		sass =          require( 'gulp-sass' ),
		gcmq =          require( 'gulp-group-css-media-queries' ),
		gutil =         require( 'gulp-util' ),
		inject =        require( 'gulp-inline-source' ),
		inlinecss =     require( 'gulp-inline-css' ),
		del =           require( 'del' ),
		stripComments = require( 'gulp-strip-comments' ),
		connect =       require( 'gulp-connect' ),
		filesToWatch = [
			'source/sass/**/*.scss',
			'source/*.html',
		];

// Build SASS
gulp.task( 'build:sass', function( done ) {
	'use strict';

	return gulp.src( 'source/sass/style.scss' )
		.pipe(
			sass( {
				outputStyle: 'compressed',
			} )
			.on( 'error', gutil.log )
		)
		.pipe( gcmq() )
		.pipe( gulp.dest( 'public/css/' ) )
		.on( 'end', done );
} );

// Inject CSS
gulp.task( 'inject:css', function( done ) {
	'use strict';

	return gulp.src( 'source/*.html' )
		.pipe(
			inject()
			.on( 'error', gutil.log )
		)
		.pipe( gulp.dest( 'public/' ) )
		.on( 'end', done );
} );

// Inline CSS
gulp.task( 'inline:css', function( done ) {
	'use strict';

	return gulp.src( 'public/*.html' )
		.pipe(
			inlinecss( {
				applyLinkTags: false,
				removeLinkTags: false,
				preserveMediaQueries: true,
			} )
			.on( 'error', gutil.log )
		)
		.pipe( gulp.dest( 'public/' ) )
		.on( 'end', done );
} );

// Clean CSS
gulp.task( 'clean:css', function( done ) {
	'use strict';

	return del( [
		'public/css/',
	] )
	.then( function() {
		done();
	} );
} );

// Clean HTML
gulp.task( 'clean:html', function( done ) {
	'use strict';

	return gulp.src( 'public/*.html' )
		.pipe(
			stripComments( {
				safe: true,
			} )
			.on( 'error', gutil.log )
		)
		.pipe( gulp.dest( 'public/' ) )
		.pipe( connect.reload() )
		.on( 'end', done );
} );

// Default (Build)
gulp.task(
	'default',
	gulp.series( [
		'build:sass',
		'inject:css',
		'inline:css',
		'clean:css',
		'clean:html',
	] )
);

// Start server w/ live reload
gulp.task( 'start', function( done ) {
	'use strict';

	connect.server( {
		port: 8000,
		root: 'public',
		livereload: true,
	} );

	done();
} );

// Watch
gulp.task( 'watch', function( done ) {
	'use strict';

	gulp.watch(
		filesToWatch,
		gulp.series( [
			'default',
		] )
	);

	done();
} );

// Development mode
gulp.task(
	'dev',
	gulp.series( [
		'default',
		gulp.parallel( [
			'start',
			'watch',
		] )
	] )
);

// Clean project folder
gulp.task( 'clean', function( done ) {
	'use strict';

	return del( [
		'public/',
	] )
	.then( function() {
		done();
	} );
} );
