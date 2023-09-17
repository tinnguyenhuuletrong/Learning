function lengthOfLongestSubstring(s: string): number {
    let start = 0,max = 0
    const mem = new Set<string>()

    for (let i = 0; i < s.length; i++) {
        const it = s[i];
        if(mem.has(it)){
            let l = i - start
            if(l > max) 
                max = l
            start++
            i = start - 1
            mem.clear()
            continue
        }
        mem.add(it)
    }

    let l = s.length - start
    if(l > max) 
        max = l

    return max
};


console.log(lengthOfLongestSubstring('abcabcbb'))
console.log(lengthOfLongestSubstring('bbbbb'))
console.log(lengthOfLongestSubstring('pwwkew'))
console.log(lengthOfLongestSubstring(''))
console.log(lengthOfLongestSubstring(' '))
console.log(lengthOfLongestSubstring("au"))
console.log(lengthOfLongestSubstring("dvdf"))