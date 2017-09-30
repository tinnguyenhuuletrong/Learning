#include <vector>
#include <limits>
#include <iostream>
using namespace std;

static long findMissingMySolution(std::vector<long> list){
    long max = LONG_MIN;
    long min = LONG_MAX;
    int maxIndex;
    int minIndex;
    
    for (int i=1; i< list.size(); i++) {
        long tmp = list[i] - list[i-1];
        if( tmp > max ) {
            max = tmp;
            maxIndex = i - 1;
        }
        
        if( tmp < min) {
            min = tmp;
            minIndex = i - 1;
        }
    }
    
    if(max < 0) return list[minIndex] + max;
    return list[maxIndex] + min;
}


// Best solution
// Since missing will not at begin and end
//   => totalSum (added miss elements) = (n+1) * (end - begin) / 2  ( n + 1 => since n is missing 1 elements )
//   => actualSum = sum all array
//   => mssing = totalSum - actualSum
static long findMissing(std::vector<long> list){
    long sum = 0;
    long n = list.size();
    for (long i : list) {
        sum += i;
    }
    return ((n+1) * (list[0]+list[n-1])) / 2 - sum;
}
void test() {
    cout << findMissing({1, 3, 7, 9, 11}) << endl;
}
