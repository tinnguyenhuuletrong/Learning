#include <string>
#include <iostream>
#include <cmath>
using namespace std;

class PrimeDecomp
{
private:
    static bool isPrime(int val);
public:
    static std::string factors(int lst);
};


inline bool PrimeDecomp::isPrime(int val) {
    bool res = true;
	for (int i = 2; i * i <= val; ++i)
	{
        if(val % i == 0){
            res = false;
            break;
        }
			
	}
	return res;
}


string PrimeDecomp::factors(int lst) {

    if(isPrime(lst))
        return "(" + to_string(lst) + ")";
    
    string res;
    int tmp = lst;
    for (int i=2; i<=lst && tmp > 1; i++) {
        if(isPrime(i)) {
            int count = 0;
            while(tmp % i == 0) {
                count++;
                tmp/=i;
            }
            
            if(count > 1) {
                res += "(" + std::to_string(i) + "**" + to_string(count) + ")";
            }
            else if(count == 1) {
                res += "(" + std::to_string(i) + ")";
            }
        }
    }

    return res;
}

void test() {
    
    //"(2**2)(3**3)(5)(7)(11**2)(17)"
    //cout << PrimeDecomp::factors(7775460) << endl;
    cout << PrimeDecomp::factors(7919) << endl;
    
}
