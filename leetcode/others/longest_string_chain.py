from typing import List


class Solution:
    def is_predecessor(self, a: str, b:str) -> bool:
        checkAt = 0
        if a == b:
            return False
        if abs(len(a) - len(b)) >1:
            return False
        
        for i in range(len(a)):
            is_ok = False
            while checkAt < len(b):
                if b[checkAt] == a[i]:
                    checkAt+=1
                    is_ok = True
                    break
                else:
                    checkAt+=1
            if not is_ok:
                return False
        return True
    
    def longestStrChain(self, words: List[str]) -> int:
        words.sort(key=lambda v: len(v))
        l = len(words)
        tmp = [None] * l
        res = [0] * l
        tmp[0] = [words[0]]
        res[0] = 1
        # print(words)
        for i in range(1, l):
            val = words[i]
            j = i -1
            m = 1
            prev_index = -1
            # print("start_at", i, val)
            while j >= 0:
                check = self.is_predecessor(words[j], val)
                if check == True:
                    new_m = res[j] + 1
                    if new_m > m:
                        prev_index = j
                        m = new_m
                j-=1
            # print("max_at", i, val, "->", m)
            if prev_index >=0:
                tmp[i] =  tmp[prev_index] + [val]
            else:
                tmp[i] = [val]
            res[i] = m

        # print(res)
        # print(*tmp, sep='\n')
        return max(res)



tmp = Solution()

# # print(tmp.is_predecessor('gr','ks'))
print('1', '->', tmp.longestStrChain(["a","b","ba","bca","bda","bdca"]), '==', 4)
print('2', '->', tmp.longestStrChain(["xbc","pcxbcf","xb","cxbc","pcxbc"]), '==', 5)
print('2', '->', tmp.longestStrChain(["abcd","dbqca"]), "==", 1)
print('2', '->', tmp.longestStrChain(["a","b","ba","abc","abd","bdca"]), "==", 2)
print('2', '->', tmp.longestStrChain(["ksqvsyq","ks","kss","czvh","zczpzvdhx","zczpzvh","zczpzvhx","zcpzvh","zczvh","gr","grukmj","ksqvsq","gruj","kssq","ksqsq","grukkmj","grukj","zczpzfvdhx","gru"]), "==", 7)
print('2', '->', tmp.longestStrChain(["a","ab","ac","bd","abc","abd","abdd"]), "==", 4) #-> 4
print('2', '->', tmp.longestStrChain(["wnyxmflkf","xefx","usqhb","ttmdvv","hagmmn","tmvv","pttmdvv","nmzlhlpr","ymfk","uhpaglmmnn","zckgh","hgmmn","isqxrk","isqrk","nmzlhpr","uysyqhxb","haglmmn","xfx","mm","wymfkf","tmdvv","uhaglmmn","mf","uhaglmmnn","mfk","wnymfkf","powttkmdvv","kwnyxmflkf","xx","rnqbhxsj","uysqhb","pttkmdvv","hmmn","iq","m","ymfkf","zckgdh","zckh","hmm","xuefx","mv","iqrk","tmv","iqk","wnyxmfkf","uysyqhb","v","m","pwttkmdvv","rnqbhsj"]), "==", 10) 


