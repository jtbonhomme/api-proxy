var util       = require('util'),
    connect    = require('connect'),
    url        = require('url'),
    colors     = require('colors'),
    http       = require('http'),
    localPort  = 8080,
    listenPort = 80,
    directory  = '/Users/jean-thierrybonhomme/Developpements/r7/webapp/public';

var welcome = [
    "   ##   #####  #       #####  #####   ####  #    # #   #",
    "  #  #  #    # #       #    # #    # #    #  #  #   # # ",
    " #    # #    # # ##### #    # #    # #    #   ##     #  ",
    " ###### #####  #       #####  #####  #    #   ##     #  ",
    " #    # #      #       #      #   #  #    #  #  #    #  ",
    " #    # #      #       #      #    #  ####  #    #   #  "
].join('\n');

util.puts(welcome.rainbow.bold);

http.createServer( function( request, response )
{
        var url_parts = url.parse( request.url ),
            options;

        console.log("URL : " + url_parts.href);
        console.log("PATH : " + url_parts.href.split('/')[1]);

        // todo : create an array of hashes [ {ip: "xxx.xxx.xxx.xxx", routes: ["/xxx", "/yyy"] } ] to decide how to serve files
        switch(url_parts.href.split('/')[1])
        {
            case "":
            case "js":
            case "img":
            case "fonts":
            case "css":
                options = {
                        hostname        : '127.0.0.1',
                        port            : 8080,
                        path            : url_parts.path,
                        method          : request.method,
                        headers         : request.headers
                };
                break;
            default:
                options = {
                        hostname        : '10.0.2.13',
                        port            : 80,
                        path            : url_parts.path,
                        method          : request.method,
                        headers         : request.headers
                };
                break;
        }
        console.log("HOST : " + options.hostname);

        var request_data;
    
        var proxy_client = http.request( options, function( res )
        {
                console.log( 'Sending request ', options );
    
             res.on( 'data', function ( chunk )
                {
                        console.log( 'Write to client ', chunk.length );
                        response.write( chunk, 'binary' );
                        console.log(chunk);
                } );
    
             res.on( 'end', function()
                {
                        console.log( 'End chunk write to client' );
                        response.end();
                } );
    
             res.on( 'error', function ( e )
                {
                        console.log( 'Error with client ', e );
                } );
    
             response.writeHead( res.statusCode, res.headers );
        } );
    
     request.on( 'data', function ( chunk )
        {
                console.log( 'Write to server ', chunk.length );
                console.log( chunk );
                console.log( chunk.toString( 'utf8' ) );
                request_data = request_data + chunk;
                proxy_client.write( chunk, 'binary' );
        } );
    
     request.on( 'end', function()
        {
                console.log( 'End chunk write to server' );
                proxy_client.end();
        } );
    
     request.on( 'error', function ( e )
        {
                console.log( 'Problem with request ', e );
        } );

} ).listen( listenPort );

connect()
    .use(connect.static( directory ))
    .listen(localPort);

console.log( 'Proxy started on port ' + listenPort );
