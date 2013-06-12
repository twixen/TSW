var express = require('express');
var io = require('socket.io');
var app = express();

app.configure(function() {
    app.set('port', 5000);
    app.set('views', 'views');
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(express.favicon('public/img/favicon.ico'));
    app.set('tree', []);
    app.set('player', []);
});

var io = io.listen(app.listen(app.get('port')));
io.set('log level', 0);

var index = function(req, res) {
    res.render('index');
};
app.get('/', index);

var Player = function() {
    var x;
    var y;
    var id;
    var dead = false;
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
    var setDead = function() {
        dead = true;
    };
    var getDead = function() {
        return  dead;
    };
    return {
        getX: getX,
        setX: setX,
        getY: getY,
        setY: setY,
        getID: getID,
        setID: setID,
        getDead: getDead,
        setDead: setDead
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
    socket.on('init', function(data) {
        socket.emit('init', generateBoard(initPlayer(data.id)));
    });
    socket.on('move', function(data) {
        socket.emit('move', generateBoard(movePlayer(data, playerByID(data.id))));
        socket.broadcast.emit('refresh');
    });
    socket.on('refresh', function(data) {
        socket.emit('move', generateBoard(movePlayer(data, playerByID(data.id))));
    });
});

var initTree = function() {
    tree = app.get('tree');

    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
            t = new Tree;
            t.setX(i * 120 - 1200 + Math.round((Math.random())) * 40);
            t.setY(j * 120 - 1200 + Math.round((Math.random())) * 40);
            tree[tree.length] = t;
        }
    }
    app.set('tree', tree);
};
initTree();
var initPlayer = function(id) {
    if (id) {
        var p = playerByID(parseInt(id));
        if (p) {
            return p;
        }
        else {
            return newPlayer();
        }
    }
    else {
        return newPlayer();
    }
};
var newPlayer = function() {
    var player = app.get('player');
    p = new Player();
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
    for (var i = 0; i < p.length; i++) {
        if (p[i].getID() === id) {
            return p[i];
        }
    }
    return false;
};
var movePlayer = function(data, p) {
    switch (data.direction) {
        case 37:
            p.setX(p.getX() - 40);
            if (checkTree(p))
                p.setX(p.getX() + 40);
            var op = checkOpp(p);
            if (op)
                fight(op, p);
            break;
        case 38:
            p.setY(p.getY() - 40);
            if (checkTree(p))
                p.setY(p.getY() + 40);
            var op = checkOpp(p);
            if (op)
                fight(op, p);
            break;
        case 39:
            p.setX(p.getX() + 40);
            if (checkTree(p))
                p.setX(p.getX() - 40);
            var op = checkOpp(p);
            if (op)
                fight(op, p);
            break;
        case 40:
            p.setY(p.getY() + 40);
            if (checkTree(p))
                p.setY(p.getY() - 40);
            var op = checkOpp(p);
            if (op)
                fight(op, p);
            break;
    }
    return p;
};
var fight = function(p1, p2) {
    
        p1.setDead();
    
};
var checkTree = function(p) {
    tree = app.get('tree');
    for (var i = 0; i < tree.length; i++) {
        if (p.getX() === tree[i].getX() && p.getY() === tree[i].getY()) {
            return true;
        }
    }
    return false;
};
var checkOpp = function(p) {
    player = app.get('player');
    for (var i = 0; i < player.length; i++) {
        if (p !== player[i] && p.getX() === player[i].getX() && p.getY() === player[i].getY()) {
            return player[i];
        }
    }
    return false;
};
var generateBoard = function(p) {
    var xmin = p.getX() - 200;
    var xmax = p.getX() + 200;
    var ymin = p.getY() - 200;
    var ymax = p.getY() + 200;
    var x = p.getX() - 200;
    var y = p.getY() - 200;
    tree = app.get('tree');
    var newtree = [];
    for (var i = 0; i < tree.length; i++) {
        if (tree[i].getX() >= xmin && tree[i].getX() <= xmax && tree[i].getY() >= ymin && tree[i].getY() <= ymax) {
            newtree[newtree.length] = {x: tree[i].getX() - x, y: tree[i].getY() - y};
        }
    }
    player = app.get('player');
    var opponent = [];
    for (var i = 0; i < player.length; i++) {
        if (p !== player[i] && player[i].getDead() === false && player[i].getX() >= xmin && player[i].getX() <= xmax && player[i].getY() >= ymin && player[i].getY() <= ymax) {
            opponent[opponent.length] = {x: player[i].getX() - x, y: player[i].getY() - y};
        }
    }
    return {
        dead: p.getDead(),
        id: p.getID(),
        tree: newtree,
        player: opponent
    };
};