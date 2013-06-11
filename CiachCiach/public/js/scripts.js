var socket = io.connect('http://localhost');
var canvas, ctx, images, id;

var onReady = function() {
    canvas = $('#canvas')[0];
    ctx = canvas.getContext('2d');
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('init', onInit);
    socket.on('move', onMove);
    socket.on('refresh', onRefresh);
};
var onConnect = function() {
    id = document.cookie.split('=')[1];
    socket.emit('init', {id: id});
    $(document).keydown(onKey);
};
var onDisconnect = function() {
};

var onRefresh = function(data) {
    socket.emit('refresh', {id: id});
};

var onInit = function(data) {
    if (!id || id !== data.id) {
        var now = new Date();
        var time = now.getTime();
        now.setTime(time + 31536000000);
        document.cookie = 'SESSIONID=' + data.id + ';expires=' + now.toGMTString();
    }
    id = data.id;
    onMove(data);
};

var onMove = function(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (data.dead === true) {
        ctx.drawImage(images[4], 0, 0);
        $(document).unbind('keydown');
    }
    else {
        ctx.drawImage(images[0], 0, 0);
        ctx.drawImage(images[2], 200, 200);
        for (var i = 0; i < data.tree.length; i++)
        {
            ctx.drawImage(images[1], data.tree[i].x, data.tree[i].y);
        }
        for (var i = 0; i < data.player.length; i++)
        {
            ctx.drawImage(images[3], data.player[i].x, data.player[i].y);
        }
    }
};

var onKey = function(e) {
    if (e.which > 36 && e.which < 41)
    {
        socket.emit('move', {id: id, direction: e.which});
    }
};

var initImages = function() {
    images = [];
    var img = new Image();
    img.src = "img/bg.png";
    images[0] = img;
    img = new Image();
    img.src = "img/tree.png";
    images[1] = img;
    img = new Image();
    img.src = "img/you.png";
    images[2] = img;
    img = new Image();
    img.src = "img/op.png";
    images[3] = img;
    img = new Image();
    img.src = "img/bg2.png";
    images[4] = img;
};


initImages();
$(window).ready(onReady);

