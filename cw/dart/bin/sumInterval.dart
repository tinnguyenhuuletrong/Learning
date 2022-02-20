// https://www.codewars.com/kata/52b7ed099cdc285c300001cd/train/dart

import 'dart:math';

void main(List<String> args) {
  print(sumOfIntervals([
    [1, 4],
    [7, 10],
    [3, 5]
  ]));

  print(sumOfIntervals([
    [1, 5],
  ]));

  print(sumOfIntervals([
    [1, 5],
    [6, 10]
  ]));

  print(sumOfIntervals([
    [1, 5],
    [1, 5]
  ]));

  print(sumOfIntervals([
    [1, 4],
    [7, 10],
    [3, 5]
  ]));
}

int sumOfIntervals(List<List<int>> intervals) {
  // your code here
  if (intervals.isEmpty) return 0;

  // Step 1 sort by start time
  intervals.sort((a, b) {
    return a[0].compareTo(b[0]);
  });

  List<List<int>> res = [];
  res.add(intervals[0]);

  // Step 2: Check merge overlapped
  for (var i = 1; i < intervals.length; i++) {
    var itm = intervals[i];
    var c = itm[0];
    var d = itm[1];
    var a = res.last[0];
    var b = res.last[1];

    // check overlap for [a , b] [c, d] where c >= a
    // case can merge is
    //  a -- c --- b --- d
    //  a -- c --- d --- b
    var shouldMerge = false;
    if (a <= c && c <= b) {
      shouldMerge = true;
      res.last[0] = a;
      res.last[1] = max(b, d);
    }
    if (!shouldMerge) res.add(itm);
  }
  return res.fold<int>(
      0, (previousValue, element) => previousValue + element[1] - element[0]);
}
