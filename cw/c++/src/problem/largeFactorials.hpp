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
    
    string getData() {
        return data;
    }
    
    static BigNum add(BigNum val1, BigNum val2) {
        
        int maxLen = max(val1.data.length(), val2.data.length());
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
    
    static BigNum mul(BigNum val1, char num) {
        
        string res = "";
        int len = val1.data.length();
        int a = num - '0';
        
        int remain = 0;
        for(int i= len - 1; i>=0; i--) {
            int tmp = a * (val1.data[i] - '0') + remain;
            remain = tmp / 10;
            
            res = to_string(tmp % 10) + res;
        }
        
        if(remain != 0)
            res = to_string(remain) + res;
        
        return BigNum(res);
    }
    
    static BigNum mul(BigNum val1, BigNum val2) {
        BigNum res = BigNum("0");
        
        int len2 = val2.data.length();
        
        for (int i= len2 -1; i>=0; i--) {
            BigNum tmp = mul(val1, val2.data[i]);
            tmp.data = tmp.data.append(len2 - 1 - i, '0');
            res = add(res, tmp);
            
//            cout << tmp << ":" << res <<endl;
        }
        
//        cout << val1 << ":" << val2 << ":" << res <<endl;
        
        return BigNum(res);
    }
    
    friend std::ostream& operator<<(std::ostream& o, BigNum const& a) {
        o << a.data;
        return o;
    }
};

string factorial(int factorial){
    BigNum res("1");
    
    for (int i=1; i<=factorial; i++) {
        res = BigNum::mul(res, to_string(i));
    }
    
    return res.getData();
}

void test() {
   
    cout << factorial(25) << endl;
}
