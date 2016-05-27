var static = require( 'node-static' ),
    port = 8080,
    http = require( 'http' );

var file = new static.Server( __dirname + '/public', {
    cache: 3600,
    gzip: true
} );

// serve
http.createServer( function ( request, response ) {
    request.addListener( 'end', function () {
        console.log('serving you mofo', request.url);
        file.serve( request, response );
    } ).resume();
} ).listen( port );