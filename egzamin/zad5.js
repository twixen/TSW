var isOdd = function(n) {
    return n % 2 === 1;
}
(function() {
    var tab = [3, 4, '13', Infinity, -9];
    for (var i = 0; i < tab.length; i += 1) {
        if (isOdd(tab[i])) {
            console.log(tab[i]);
        }
    }
})();

// 3 13