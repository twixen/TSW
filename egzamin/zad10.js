var licznik = function()
{
    if (typeof licznik.i == 'undefined')
        licznik.i = 1;
    else
        licznik.i += 1;
    return licznik.i;
};