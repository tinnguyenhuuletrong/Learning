#include <cmath>
#include <iostream>
using namespace std;

const int MAGICCOUNT = 6;
const int MAGIC_NUMBERS[] = {1, 10, 9, 12, 3, 4};

class Thirteen
{
private:
    static long long next(long long n);
public:
    static long long thirt(long long n);
};

long long Thirteen::next(long long n) {
    long long res = 0;
    long long tmp = n;
    int i = 0;
    while(tmp > 0) {
        long long val = tmp % 10;
        //cout << tmp % 10 << ":" << MAGIC_NUMBERS[i] << endl;
        tmp /= 10;
        
        res += val * MAGIC_NUMBERS[i];
        i = (i + 1) % MAGICCOUNT;
    }
    return res;
}

long long Thirteen::thirt(long long n) {
    long long last = n;
    while(true) {
//        cout << last << " ";
        long long tmp = next(last);
        if(tmp == last)
            break;
        last = tmp;
    }
    return last;
}


void test() {
    cout << Thirteen::thirt(1234567);
}
