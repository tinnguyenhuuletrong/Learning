#include <functional>
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;
int stray(std::vector<int> numbers) {
    int diff = numbers[0];
    
    for(auto i : numbers) {
        if(i != diff) return i;
    }
    
    return diff;
};

void test() {
    const int res = stray({1, 2, 1});
    cout << res << endl;
}
