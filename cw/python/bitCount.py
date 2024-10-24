# https://www.codewars.com/kata/526571aae218b8ee490006f4/train/python

def count_bits(n):
    return sum([x == '1' for x in bin(n)[2:]])

if __name__ == "__main__":
    inp = 0
    ans = 0
    res = count_bits(inp)
    print(res, ans == res)

    inp = 10
    ans = 2
    res = count_bits(inp)
    print(res, ans == res)

