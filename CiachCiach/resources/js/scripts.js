$(document).ready(function() {
    for (var i = 0; i < 121; i++)
    {
        $('#board').append('<div></div>');
    }
    var socket = io.connect('http://localhost');
    socket.on('init', function(data) {
        //console.log(data);
        $(document).keydown(function(e) {
            
            if (e.which > 36 && e.which < 41)
            {
                console.log(e.which);
                socket.emit('move', {direction: e.which});
            }
        });
    });
    socket.on('move', function(data) {
        console.log(data);
    });
});
