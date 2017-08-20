const exp = /(0+1(0+1(01*00)*01*01(0+1))*1(01*00)*1)*/g

const inp = "1110"
const res = inp.match(exp)
console.log(res)

