#include <functional>
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template<class TYPE>
int getLengthOfMissingArray(std::vector<std::vector<TYPE>> arrayOfArrays)
{
    vector<int> lengs;
    int size = arrayOfArrays.size();
    lengs.resize(size);
    
    bool isValid = true;
    std::transform(arrayOfArrays.begin(), arrayOfArrays.end(), lengs.begin(), [&isValid](auto itm) {
        if(itm.size() == 0 )
            isValid = false;
        
        return itm.size();
    });
    
    if(!isValid)
        return 0;
    
    sort(lengs.begin(), lengs.end());
    
    for (int i =0; i < size -1; i++) {
        if(lengs[i] + 1  != lengs[i+1])
            return lengs[i] + 1;
    }
    
    return 0;
}

void test() {
    int expected = 3;
    
    std::vector<std::vector<int>> testInput = { { 1, 2 }, { 4, 5, 1, 1 }, { 1 }, { 5, 6, 7, 8, 9 } };
    int actual = getLengthOfMissingArray(testInput);
    
    std::cout << actual << std::endl;
}
