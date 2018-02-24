// https://www.codewars.com/kata/tap-into-mr-mxyzinjins-matrix/train/javascript

// Method: 
//  1. Write proxy with getter 
//  2. scan pass 
//  abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()`~!@#$%^&*-+=|\{}[]:;"'<>,.?/
const POSSIBLE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()`~!@#$%^&*-+=|\{}[]:;"\'<>,.?/'
function crack(login) {
    const scanner = {}
    let passLength = 0, currentIndex = 0, scanIndex = 0;
    let finalPass = []
    const proxy = new Proxy(scanner, {
        get: function (target, prop, receiver) {

            if (prop === 'length') {
                return 0;
            }

            prop = parseInt(prop)

            if (prop < scanIndex) return finalPass[prop];
            else if (prop > scanIndex) {
                finalPass.push(POSSIBLE[currentIndex])
                currentIndex = 0
                scanIndex = prop;
            } else 
              return POSSIBLE[++currentIndex]

        }
    })

    while (!login(proxy)) { }
    finalPass.push(POSSIBLE[currentIndex]);
    return finalPass.join('');
}

// Test Case

makeLogin = passwd => {
    return function check(pw) {
        return !(
            Array.isArray(pw)
            ||
            pw.length > passwd.length)
            &&
            [...passwd].every((c, i) => c === pw[i]);
    }
}

function test(passwd) {
    const login = makeLogin(passwd);
    console.log(crack(login));
}

test('m0#d;\'O2|M!}-]{0/VA0\'');
test('R?$t8B(?7sq;PxET</')