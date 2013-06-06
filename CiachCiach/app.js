var express = require('express');
var io = require('socket.io');
var routes = require('./routes');
var app = express();

app.configure(function() {
    app.set('port', 3000);
    app.set('views', 'views');
    app.set('view engine', 'ejs');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('secret'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static('public'));
    app.use(express.favicon('public/favicon.ico'));
});

app.get('/', routes.index);
app.get(/^\/init\/?/, routes.init);
app.get(/^\/play\/((size\/(\d+)\/)?(dim\/(\d+)\/)?(max\/(\d+)\/)?)?/, routes.play);
app.get(/^\/mark\/((?:\d+\/)+)$/, routes.mark);



server = require('http').createServer(app).listen(app.get('port'), function() {
    console.log("Serwer nas³uchuje na porcie " + app.get('port'));
});

var io = io.listen(server);
io.sockets.on('connection', function(socket) {
    socket.emit('init');

    socket.on('move', function(data) {
        socket.emit('move', app.get('puzzle'));
    });
});

