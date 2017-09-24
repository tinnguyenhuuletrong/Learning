#include <iostream>
#include <string>
#include <cmath>
using namespace std;

string expand(int value)
{
    const string ENGLISH_ONE_NUMS[20] = {"zero", "one", "two", "three","four","five","six","seven",
        "eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen",
        "eighteen","nineteen"};
   
    return ENGLISH_ONE_NUMS[value];
}

// 6.3, 4.5, 3.29
void test() {
    double l = 6.3;
    double w = 4.5;
    double h = 3.29;
    
    double s = l*h*2 + w*h*2;
    double ROLL_S = (52.0 / 100) * 10;
    int rolls = ceil((s * 1.15) / ROLL_S);
    
    cout <<expand(rolls);
}
