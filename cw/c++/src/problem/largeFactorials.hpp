#include <string>
#include <cmath>
#include <iostream>
using namespace std;

class BigNum {
private:
    string data;
    string pad(int len) {
        string res = data;
        while (res.length() < len) {
            res = "0" + res;
        }
        return res;
    }
    
public:
    BigNum(string val) {
        data = val;
    }
    
    static BigNum add(BigNum val1, BigNum val2) {
        
        int maxLen = max(val1.data.length(), val1.data.length());
        string num2 = val2.pad(maxLen);
        string num1 = val1.pad(maxLen);
        
        string res = "";
        
        int remain = 0;
        for (int i=maxLen - 1; i >= 0; i--) {
            int a = num1[i] - '0';
            int b = num2[i] - '0';
            int tmp = remain + a + b;
            remain = tmp / 10;
            
            res = to_string(tmp % 10) + res;
        }
        
        if(remain != 0)
            res = "1" + res;
    
        return BigNum(res);
    }
    
    static BigNum mul(BigNum val1, BigNum val2) {
        
        int maxLen = max(val1.data.length(), val1.data.length());
        string num2 = val2.pad(maxLen);
        string num1 = val1.pad(maxLen);
        
        string res = "";
        
        return BigNum(res);
    }
    
    friend std::ostream& operator<<(std::ostream& o, BigNum const& a) {
        o << a.data;
        return o;
    }
};

string factorial(int factorial){

}

void test() {
    BigNum a("100");
    BigNum b("1100");
    
    BigNum tmp = BigNum::add(a,b);
    cout << tmp;
}
