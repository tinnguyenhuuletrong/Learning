//https://www.codewars.com/kata/number-~for-kids~-number-date-encryption/train/javascript
function translateDate(dateStr){
    let reg = /([0-9]{2})/g;
    let groups = [];
    let tmp;
    while(tmp=reg.exec(dateStr)) groups.push(tmp)
    groups = groups.map(itm => String.fromCharCode(+itm[0] + 50))
    let [a,b,c,d] = groups;
    return `${a}${b}-${c}-${d}`
}


function test(input) {
    console.log(translateDate(input));
}

test('2017-01-21')