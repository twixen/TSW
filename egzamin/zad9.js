Number.prototype.mult = function() {
    var w = this;
    for (var i = 0; i < arguments.length; i += 1)
        w *= arguments[i];
    return w;
}
var n = 12;
console.log(n.mult(2, 3));
console.log((5).mult(2, n));