import re
class Solution:
    def _simulate(self, pattern: str, s: str) -> int:
        c = 0
        matcher = pattern*3
        replace_by = pattern*2
        while True:
            (s, n) = re.subn(matcher, replace_by, s)
            # print(s, n)
            if n <= 0:
                break
            c +=n
        return c
    
    def winnerOfGame(self, colors: str) -> bool:
        scoreA = self._simulate("A", colors)
        scoreB = self._simulate("B", colors)
        # print(scoreA, scoreB)
        return scoreA > scoreB


a = Solution()
inp = "AAABABB"
print(inp, a.winnerOfGame(inp))
inp = "AA"
print(inp, a.winnerOfGame(inp))
inp = "ABBBBBBBAAA"
print(inp, a.winnerOfGame(inp))
inp = "AAAAABBBBBBAAAAA"
print(inp, a.winnerOfGame(inp))
