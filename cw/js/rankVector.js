// https://www.codewars.com/kata/545f05676b42a0a195000d95/train/javascript

function ranks(a) {
  if (a.length <= 0) return [];
  const tmp = a
    .map((itm, idx) => {
      return {
        val: itm,
        idx,
        rank: 1,
      };
    })
    .sort((a, b) => {
      return b.val - a.val;
    });

  // Rank assign
  let r = 1;
  let lastVal = tmp[0].val;
  for (let i = 0; i < tmp.length; i++) {
    const itm = tmp[i];
    if (itm.val < lastVal) {
      r = i + 1;
      lastVal = itm.val;
    }
    itm.rank = r;
  }

  // console.log(tmp);

  const res = Array(a.length);
  for (let i = 0; i < a.length; i++) {
    const idx = tmp[i].idx;
    res[idx] = tmp[i].rank;
  }
  return res;
}

{
  const inp = [9, 3, 6, 10];
  const res = ranks(inp);
  console.log(`${inp} -> ${res}`);
}

{
  const inp = [3, 3, 3, 3, 3, 5, 1];
  const res = ranks(inp);
  console.log(`${inp} -> ${res}`);
}

{
  const inp = [];
  const res = ranks(inp);
  console.log(`${inp} -> ${res}`);
}
