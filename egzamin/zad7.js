var object, u1, u2;
object = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
};
u1 = {'name': 'adam'};
u2 = object(u1);
u2.name = 'roman';
delete u1.name;
console.log(u2.name);
delete u2.name;
console.log(u2.name);
u1.name = 'tytus';
console.log(u2.name);

// roman undefined titus