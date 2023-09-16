class Solution {
    private internalIndex: Map<number, number[]> = new Map()
    constructor(nums: number[]) {
        for (let i = 0; i < nums.length; i++) {
            const val = nums[i];
            let arr = this.internalIndex.get(val)
            if(!arr) {
                this.internalIndex.set(val, [i])
            } else 
                arr.push(i)
        }
    }

    pick(target: number): number {
        const arr = this.internalIndex.get(target) || []
        return arr[Math.floor(Math.random()*arr.length)]
    }
}

var obj = new Solution([1,2,3,3,3])
console.log(obj)
var param_1 = obj.pick(1)
console.log(param_1)