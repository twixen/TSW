var x = 'world';
(function() {
    if (typeof x === 'undefined') {
        var x = 'Mr Bond';
        console.log('Goodbye, ' + x);
    } else {
        console.log('Hello, ' + x);
    }
})();
// Goodbye, Mr Bond