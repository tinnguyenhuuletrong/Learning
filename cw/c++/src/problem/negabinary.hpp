#include <string>
#include <cmath>
#include <iostream>
const int BASE = -2;

class Negabinary{
public:
  static std::string ToNegabinary(int i);
  static int ToInt(std::string s); 
};


// [ToNegabinary]
// Find remainer d:
// 		d > 0
//		d min
std::string Negabinary::ToNegabinary(int n) {
    std::string res;
    int a = n;
    int remainer = 0;
    
    do {
        
        int tmp = a/BASE;
        
        while(a - tmp*BASE < 0) {
            tmp++;
        }
        remainer = a - tmp*BASE;
        a = tmp;
        
        res.insert(0, std::to_string(remainer));
    } while(a !=0);
    
    return res;
}

// [ToInt]
int Negabinary::ToInt(std::string s)
{
    int res = 0;
    int len = s.length();
    
    for (int i=0; i<len; i++) {
        
        if(s[len - i - 1] == '1')
            res += (int)std::pow(BASE, i);
    }
    return res;
}

void test() {
    std::string tmp = Negabinary::ToNegabinary(6);
    std::cout<< tmp << std::endl;
    
    std::cout<< Negabinary::ToInt(tmp) << std::endl;
    
}
