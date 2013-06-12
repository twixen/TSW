var trojmian = function() {
    var a = 2, b = 3, c = 7,
    mult = function() {
        var i, res = 1;
        for (var i = 0; i < arguments.length; i += 1)
            res *= arguments[i];

        return res;
    },
    delta = function() {
        return mult(b, b) - mult(4, a, c);
    };
    return {
        a: a,
        b: b,
        c: c,
        delta: delta
    };
};