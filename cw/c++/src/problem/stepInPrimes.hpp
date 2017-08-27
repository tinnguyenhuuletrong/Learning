#include <functional>
#include <algorithm>
#include <iostream>
#include <vector>
#include <cmath>
#include <utility>
#include <vector>

using namespace std;

class StepInPrimes
{
public:
    // if there are no such primes return {0, 0}
    static std::pair <long long, long long> step(int g, long long m, long long n) {
        
        std::vector<long long> primes;
        for (long long i = m; i < n; i++) {
            if(StepInPrimes::isPrimer(i) && StepInPrimes::isPrimer(i + g))
                return {i, i + g};
        }
        return {0,0};
    }
    
    static long long isPrimer(long long val) {
        long long upper = sqrt(val);
        
        for(auto i = 2; i <= upper; i++) {
            if( val % i == 0)
                return false;
        }
        return true;
    }
};

void test() {
    auto res = StepInPrimes::step(6,100,110);
    std::cout << res.first << ":" << res.second << std::endl;
}
