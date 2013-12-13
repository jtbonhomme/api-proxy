var util       = require('util'),
    colors     = require('colors'),
    http       = require('http'),
    httpProxy  = require('http-proxy'),
    httpPort   = 80;

var apiUrl     = '192.168.1.1',
    apiPort    = 80;

var welcome = [
"   ##   #####  #       #####  #####   ####  #    # #   #", 
"  #  #  #    # #       #    # #    # #    #  #  #   # # ", 
" #    # #    # # ##### #    # #    # #    #   ##     #  ", 
" ###### #####  #       #####  #####  #    #   ##     #  ", 
" #    # #      #       #      #   #  #    #  #  #    #  ", 
" #    # #      #       #      #    #  ####  #    #   #  " 
].join('\n');

util.puts(welcome.rainbow.bold);

//
// Create your proxy server
// It will listen on localhot:80 and send http request to localhost:8080
//
//httpProxy.createServer(80, '192.168.1.1').listen(80);

/*httpProxy.createServer(function (req, res, proxy) {
  //
  // Put your custom server logic here
  //
  proxy.proxyRequest(req, res, {
    host: '192.168.1.1',
    port: 80
  });
  util.log(res);
}).listen(80);*/

var http = require( 'http' );
var url = require( 'url' );

var listen_port = 80;

http.createServer( function( request, response )
{
        var url_parts = url.parse( request.url );

        var options = {
                hostname        : '192.168.1.1',
                port            : 80,
                path            : url_parts.path,
                method          : request.method,
                headers         : request.headers
        };

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

} ).listen( listen_port );

console.log( 'Proxy started on port ' + listen_port );
