// https://www.codewars.com/kata/52f677797c461daaf7000740/train/typescript

function iter(A: number[]): [boolean, number[]] {
  let min = 0,
    max = A.length - 1;

  if (A[max] <= A[min]) {
    return [false, A];
  }

  let newVal = A[max] - A[min];
  let insertId = A.length - 1;
  for (let i = 0; i < A.length - 1; i++) {
    if (A[i] >= newVal) {
      insertId = i;
      break;
    }
  }

  const res = [
    ...A.slice(0, insertId),
    newVal,
    ...A.slice(insertId, A.length - 1),
  ];
  return [true, res];
}

export function solution_1(numbers: number[]): number {
  let hasNext = true;
  let A = numbers.sort((a, b) => a - b);
  // console.log("Begin", A);
  let count = 0;
  while (hasNext) {
    [hasNext, A] = iter(A);
    // if (A[0] == A[A.length / 4]) {
    //   break;
    // }
    // console.log(hasNext, A);
    count++;
  }
  console.log("Final:", count, A);
  // const sum = A.reduce((acc, itm) => acc + itm, 0);
  const sum = A[0] * A.length;
  return sum;
}

function gcd(a: number, b: number): number {
  if (a == 0) return b;
  return gcd(b % a, a);
}
export function solution(numbers: number[]): number {
  let res = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    res = gcd(res, numbers[i]);
    if (res === 1) break;
  }

  return res * numbers.length;
}

let A = [3, 10, 18];
console.log(solution_1(A), "vs", solution(A));
A = [
  14308876985, 259480260, 13258409060, 13604115785, 2787811065, 5831720960,
  3812918265, 474201065, 10530128960, 2278016000, 527592065, 14380331940,
  11660950340, 18341232260, 541384740, 13743644265, 16838186625, 20845270160,
  8662155840, 1819654265, 21365298500, 2249629785, 20673351140, 1218115665,
  3078525060, 19656786500, 1896804260, 3212358500, 1819654265, 753169040,
  14958378500, 13121372160, 10468996265, 820085760, 342058340, 11025597440,
  1719279185, 399453665, 269179625, 3739594625, 1480799385, 20759221665,
  22157353985, 19489850640, 9573362240, 21715543460, 2725165625, 18747448785,
  8829536625, 5125536000, 12050704640, 2452070660, 10652928260, 21715543460,
  17780003865, 925799940, 15696954000, 1457930240, 7126719665, 962461760,
  6201898560, 289112265, 14595764625, 1694630340, 2511512640, 2632532240,
  889850000, 2278016000, 3314602265, 2335322340, 1975555985, 2249629785,
  19908525065, 513977360, 6108286340, 7177174160, 7955347985, 6583466240,
  5923197540, 436026500, 3383654625, 5428885865, 19908525065, 487281860,
  3012676160, 17859645440,
];
console.log(solution_1(A), "vs", solution(A));
