#include <string>
#include <vector>
#include <iostream>

#define ull unsigned long long

class Fracts
{

public:
    static std::string convertFrac(std::vector<std::vector<ull>> &lst);
};

ull gcd(ull a, ull b) {
    if (a == 0)
        return b;
    return gcd(b%a, a);
}

ull lcm(ull a, ull b) {
    ull tmp = gcd(a,b);
    if(tmp ==0 )
        return 0;
    
    return (a*b) / tmp;
}

ull lcm(std::vector<ull> v) {
    if(v.size() <2)
        return v[0];

    ull tmp = lcm(v[0], v[1]);
    for (int i = 2; i < v.size(); ++i)
    {
        tmp = lcm(tmp, v[i]);
    }

    return tmp;
}


std::string Fracts::convertFrac(std::vector<std::vector<ull> > &lst) {
    std::vector<ull> tmp;
    std::string res = "";
    
    for (auto i = lst.begin(); i!= lst.end(); i++) {
        tmp.push_back((*i)[1]);
    }
    
    ull lcd = lcm(tmp);
    
    for (auto i = lst.begin(); i!= lst.end(); i++) {
        ull a = (*i)[0];
        ull b = (*i)[1];
        
        float ratio = 0;
        if(b!=0)
            ratio = 1.0f * a / b;
        
        ull n = (ull)(ratio * lcd);
        
        res += "(" + std::to_string(n) + "," + std::to_string(lcd) + ")";
    }
    
    return res;
}

void test() {
    std::vector<std::vector<ull>> testCase = { {27115, 5262}, {87546, 11111111}, {43216, 255689} };
    std::cout << Fracts::convertFrac(testCase) << std::endl;
}
