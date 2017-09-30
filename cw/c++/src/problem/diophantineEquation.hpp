#include <vector>
#include <cmath>
#include <utility>
#include <iostream>
using namespace std;

//x ^ 2 - 4 y ^ 2 = (x - 2y) (x + 2y).
class Dioph
{
  public:
    static std::vector<std::pair <long, long>> solEquaStr(long long n);
};

void resolve(long long a, long long b, std::vector<std::pair <long, long>> &res) {
    long long tmp = (a + b);
    if( tmp % 2 != 0) return;
    long long x = tmp / 2;
    long long tmp1 = (b - x);
    if( tmp1 < 0 || tmp1 % 2 != 0) return;
    long long y = tmp1 / 2;
    
    res.push_back({x, y});
        
};

std::vector<std::pair <long, long>> Dioph::solEquaStr(long long n) {
    
    std::vector<std::pair <long, long>> res;
    
    const long long half = sqrt(n);
    
    for(long long i=1; i< half; i++) {
        if( n % i != 0) continue;
        long long a = i;
        long long b = n / i;
        
        resolve(a,b, res);
        resolve(b,a, res);
    }
    
    return res;
}

void test() {
    auto res = Dioph::solEquaStr(90002);
    for(auto i : res) {
        cout << i.first << "," << i.second << endl;
    }
}
