var socket = io.connect('http://localhost');
var canvas, ctx, images, id;


var onReady = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    //ctx.fillStyle = "green";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

//    for (var i = 0; i < 121; i++)
//    {
//        $('#board').append('<div class="ground"></div>');
//    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('init', onInit);
    socket.on('move', onInit);
    socket.on('refresh', onRefresh);
};
var onConnect = function() {
    socket.emit('init');
    document.onkeydown = onKey;
};
var onDisconnect = function() {
     console.log('disconnected');
};

var onRefresh = function(data) {
    socket.emit('refresh', {id: id});
};

var onInit = function(data) {
    console.log('init');
    id = data.id;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
};
initImages();


//var now = new Date();
//var time = now.getTime();
//now.setTime(time + 31536000000);
//document.cookie = 'SESSIONID=' + 00000 + ';expires=' + now.toGMTString();
//console.log(document.cookie);

window.onload = onReady;
