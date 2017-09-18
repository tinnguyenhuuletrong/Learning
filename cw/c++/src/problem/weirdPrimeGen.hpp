#include <iostream>
#include <map>
#include <vector>
#include <algorithm>
using namespace std;

#define ul long long

ul gcd(ul a, ul b) {
    if (a == 0)
        return b;
    return gcd(b%a, a);
}

class WeirdPrimeGen
{
private:
	static map<ul, ul> A;
	static map<ul, ul> G;
    static ul lastPnInG;

public:
	static ul aN(ul n);
	static ul gN(ul n);
    static vector<ul> pN(ul n);
    static vector<ul> anOver(ul n);

public:
    static ul countOnes(ul n);
    static ul maxPn(ul n);
    static int anOverAverage(ul n);
};

map<ul, ul> WeirdPrimeGen::A = map<ul,ul>();
map<ul, ul> WeirdPrimeGen::G = map<ul,ul>();

ul WeirdPrimeGen::lastPnInG = 0;


ul WeirdPrimeGen::aN(ul n) {
	auto mem = A.find(n);
	if(mem != A.end())
		return mem->second;

    
    ul tmp = 7;
    if(n >= 2)
        tmp = aN(n - 1) + gcd(n, aN(n - 1));
	A[n] = tmp;

	return tmp;
}

ul WeirdPrimeGen::gN(ul n) {
    auto mem = G.find(n);
	if(mem != G.end())
		return mem->second;
    
    ul tmp = 1;
    if( n >= 2)
        tmp = aN(n - 1 + 1) - aN(n - 1);
    
	G[n] = tmp;

	return tmp;
}

//4: p(n) with parameter n: returns an array of n unique prime numbers (not tested)
vector<ul> WeirdPrimeGen::pN(ul n) {
    int count = 0;
    int index = 1;
    vector<ul> res;
    while(count < n) {
        ul tmp = gN(index++);
        ;
        if(tmp != 1
           && std::find(res.begin(), res.end(), tmp) == res.end()) {
            res.push_back(tmp);
            count++;
        }
    }
    return res;
}

ul WeirdPrimeGen::countOnes(ul n) {
    ul count = 0;
    for (ul i = 1; i<=n; i++) {
        if(gN(i) == 1) count++;
    }
    
    return count;
}

ul WeirdPrimeGen::maxPn(long long n) {
    auto tmp = pN(n);
    return *std::max_element(tmp.begin(), tmp.end());
}

//6: anOver(n) with parameter n: returns an array (n terms) of the a(i)/i for every i such g(i) != 1 (not tested but interesting result)
vector<ul> WeirdPrimeGen::anOver(ul n) {
    int count = 0;
    int index = 1;
    vector<ul> res;
    while(count < n) {
        ul tmp = gN(index++);
        if(tmp != 1) {
            res.push_back(aN((index - 1)) / (index - 1));
            count++;
        }
    }
    return res;
}

int WeirdPrimeGen::anOverAverage(long long n){
    return 3;
}

void test() 
{
	for (int i = 1; i <= 30; ++i)
	{
		cout << WeirdPrimeGen::aN(i) << " ";
	}

	cout << endl;
    
    for (int i = 1; i <= 30; ++i)
    {
        cout << WeirdPrimeGen::gN(i) << " ";
    }
    
    cout << endl;
    
    cout << WeirdPrimeGen::countOnes(10);
    
    cout << endl;
    
    auto tmp = WeirdPrimeGen::pN(5);
    for(auto i : tmp) {
        cout << i << " ";
    }
    
    cout << endl;
    
    cout << WeirdPrimeGen::maxPn(5);
    
    cout << endl;
    
    tmp = WeirdPrimeGen::anOver(3);
    for(auto i : tmp) {
        cout << i << " ";
    }
    
    cout << endl;
}
