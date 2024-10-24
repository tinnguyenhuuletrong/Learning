# https://www.codewars.com/kata/545cedaa9943f7fe7b000048

from itertools import groupby

a = "ABCD45EFGH,IJK,LMNOPQR56STUVW3XYZ"


def is_pangram(st):
    src = sorted(map(lambda x: x.lower(), filter(lambda x: x.isalpha(), st)))
    gb = groupby(src, lambda x: x)
    return len(list(gb)) == 26
