const exp = /^(0*((1(0(11|0)(111)*0)*1(01*00)*1)|(1(0|(0000)+)(01)*101)+)*)+$/;

const inp = "10010011" // 147 
const res = exp.test(inp)
console.log(res)

