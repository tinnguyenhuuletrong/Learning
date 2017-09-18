#include <string>
#include <iostream>
using namespace std;

class PrimeDecomp
{
public:
    static std::string factors(int lst);
};

string PrimeDecomp::factors(int lst) {
    string res;
    return res;
}

void test() {
    
    //"(2**2)(3**3)(5)(7)(11**2)(17)"
    cout << PrimeDecomp::factors(7775460) << endl;
    
}
