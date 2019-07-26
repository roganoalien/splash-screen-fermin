module.exports = function(
    _text,
    _color = 'default',
    _break = true,
    _empty = false
) {
    let date = new Date(),
        _date = `[${addZero(date.getHours())}:${addZero(
            date.getMinutes()
        )}:${addZero(date.getSeconds())}]`,
        _formated = `\n${_date} ${_text}\n`;
    if (!_break) {
        _formated = `${_date} ${_text}`;
    }
    if (_empty) {
        return console.log('\x1b[37m%s\x1b[0m', '\n');
    }
    switch (_color) {
        case 'yellow':
            return console.log('\x1b[33m%s\x1b[0m', _formated);
        case 'red':
            return console.log('\x1b[31m%s\x1b[0m', _formated);
        case 'blue':
            return console.log('\x1b[34m%s\x1b[0m', _formated);
        case 'purple':
            return console.log('\x1b[35m%s\x1b[0m', _formated);
        case 'green':
            return console.log('\x1b[32m%s\x1b[0m', _formated);
        default:
            return console.log('\x1b[37m%s\x1b[0m', _formated);
    }
};
function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
