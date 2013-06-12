var i, a = [, , 10, , 32, ];
a[99] = 5;
for (i = 0; i < a.length; i += 1) {
    if (i in a) {
        console.log(i);
    }
}

// 2 4 99