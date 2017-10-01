#include <iostream>
#include <string>
#include <map>
#include <cmath>
using namespace std;
// Divisors of 42 are : 1, 2, 3, 6, 7, 14, 21, 42. 
// These divisors squared are: 1, 4, 9, 36, 49, 196, 441, 1764. 
// The sum of the squared divisors is 2500 which is 50 * 50, a square!
// Given two integers m, n (1 <= m <= n) 
// we want to find all integers between m and n whose sum of squared divisors is itself a square. 42 is such a number.

class SumSquaredDivisors
{
private:
    static map<long long, long long> mem;
public:
    static std::string listSquared(long long m, long long n);
};

bool isPerfectSquare(long long n){
    long long squareRootN=(long long)round((sqrt(n)));

    if(squareRootN*squareRootN == n)
        return true;
    else 
        return false; 
     
}

map<long long,long long> SumSquaredDivisors::mem = map<long long, long long>();

std::string SumSquaredDivisors::listSquared(long long m, long long n) 
{
    string res = "";
	for (long long i = m; i <= n; ++i)
	{
        auto cache = mem.find(i);
        if(cache != mem.end()) {
            if(res.length() != 0)
                res += ", ";
            res += "{" + to_string(i) + ", " + to_string(cache->second) + "}";
            continue;
        }
        
        long long SquareSum = 0;
        long long begin = 1;
		while(begin <= i) {
			if(i% begin == 0)  {
				SquareSum += begin * begin;
			}
			begin++; 
		}

        if(isPerfectSquare(SquareSum)) {
            //cout << i << ":" << SquareSum << endl;
            if(res.length() != 0)
                res += ", ";
            res += "{" + to_string(i) + ", " + to_string(SquareSum) + "}";
            mem[i] = SquareSum;
        }
	}
    return "{" + res + "}";
}

void test() {
    cout << SumSquaredDivisors::listSquared(1, 250) << endl;
    cout << SumSquaredDivisors::listSquared(42, 250) << endl;
    cout << SumSquaredDivisors::listSquared(250, 500) << endl;
    cout << SumSquaredDivisors::listSquared(500, 600) << endl;
}
