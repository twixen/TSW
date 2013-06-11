var express = require('express');
var io = require('socket.io');
var app = express();

app.configure(function() {
    app.set('port', 3000);
    app.set('views', 'views');
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(express.favicon('public/img/favicon.ico'));
    app.set('tree', []);
    app.set('player', []);
});

var io = io.listen(app.listen(app.get('port')));
io.set('log level', 3);

var index = function(req, res) {
    res.render('index');
};
app.get('/', index);

var Player = function() {
    var x;
    var y;
    var id;
    var setX = function(newX) {
        x = newX;
    };
    var getX = function() {
        return x;
    };
    var setY = function(newY) {
        y = newY;
    };
    var getY = function() {
        return y;
    };
    var setID = function(newID) {
        id = newID;
    };
    var getID = function() {
        return  id;
    };
    return {
        getX: getX,
        setX: setX,
        getY: getY,
        setY: setY,
        getID: getID,
        setID: setID
    };
};

var Tree = function() {
    var x;
    var y;
    var setX = function(newX) {
        x = newX;
    };
    var getX = function() {
        return x;
    };
    var setY = function(newY) {
        y = newY;
    };
    var getY = function() {
        return y;
    };
    return {
        getX: getX,
        setX: setX,
        getY: getY,
        setY: setY
    };
};

io.sockets.on('connection', function(socket) {
    socket.on('move', function(data) {
        socket.emit('move', generateBoard(movePlayer(data, playerByID(data.id))));
        socket.broadcast.emit('refresh');
    });
    socket.on('init', function(data) {
        socket.emit('init', generateBoard(initPlayer()));
    });
    socket.on('refresh', function(data) {
        socket.emit('move', generateBoard(movePlayer(data, playerByID(data.id))));
    });
});

var initTree = function() {
    tree = app.get('tree');

    for (var i = 0; i < 20; i++)
    {
        for (var j = 0; j < 20; j++)
        {
            t = new Tree;
            t.setX(i * 120 - 1200 + Math.round((Math.random())) * 40);
            t.setY(j * 120 - 1200 + Math.round((Math.random())) * 40);
            //console.log(t.getX(), t.getY());
            tree[tree.length] = t;
        }
    }
    //console.log(tree);
    app.set('tree', tree);
};
initTree();

var initPlayer = function() {
    var player = app.get('player');
    var p = new Player();
    p.setID(Math.round((Math.random() * Math.pow(2, 32))));
    do {
        p.setX(Math.round((Math.random() * 40)) * 40 - 800);
        p.setY(Math.round((Math.random() * 40)) * 40 - 800);
    }
    while (checkTree(p) || checkOpp(p));
    player[player.length] = p;
    return p;
};
var playerByID = function(id) {
    var p = app.get('player');
    for (var i = 0; i < p.length; i++)
    {
        if (p[i].getID() === id) {
            return p[i];
        }
    }
};
var movePlayer = function(data, p) {
    //console.log(data);
    switch (data.direction)
    {
        case 37:
            p.setX(p.getX() - 40);
            if (checkTree(p))
                p.setX(p.getX() + 40);
            break;
        case 38:
            p.setY(p.getY() - 40);
            if (checkTree(p))
                p.setY(p.getY() + 40);
            break;
        case 39:
            p.setX(p.getX() + 40);
            if (checkTree(p))
                p.setX(p.getX() - 40);
            break;
        case 40:
            p.setY(p.getY() + 40);
            if (checkTree(p))
                p.setY(p.getY() - 40);
            break;
    }
    return p;
};
var checkTree = function(p) {
    tree = app.get('tree');
    for (var i = 0; i < tree.length; i++)
    {
        if (p.getX() === tree[i].getX() && p.getY() === tree[i].getY()) {
            return true;
        }
    }
    return false;
};
var checkOpp = function(p) {
    player = app.get('player');
    for (var i = 0; i < player.length; i++)
    {
        if (p !== player[i] && p.getX() === player[i].getX() && p.getY() === player[i].getY()) {
            return true;
        }
    }
    return false;
};
var generateBoard = function(p) {
    //console.log(p);
    var xmin = p.getX() - 200;
    var xmax = p.getX() + 200;
    var ymin = p.getY() - 200;
    var ymax = p.getY() + 200;
    var x = p.getX() - 200;
    var y = p.getY() - 200;
    //console.log(p.getX(), p.getY());
    tree = app.get('tree');
    var newtree = [];
    for (var i = 0; i < tree.length; i++)
    {
        if (tree[i].getX() >= xmin && tree[i].getX() <= xmax && tree[i].getY() >= ymin && tree[i].getY() <= ymax) {
            newtree[newtree.length] = {x: tree[i].getX() - x, y: tree[i].getY() - y};
        }
    }
    player = app.get('player');
    var opponent = [];
    for (var i = 0; i < player.length; i++)
    {
        if (p !== player[i] && player[i].getX() >= xmin && player[i].getX() <= xmax && player[i].getY() >= ymin && player[i].getY() <= ymax) {
            opponent[opponent.length] = {x: player[i].getX() - x, y: player[i].getY() - y};
        }
    }
    //console.log(newtree);
    return {
        id: p.getID(),
        tree: newtree,
        player: opponent
    };
};