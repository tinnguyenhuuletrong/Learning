#include <string>
#include <iostream>


#define OFF '0'
#define ON  '1'

inline void update(std::string& S, int n, int x, int y, char val = ON)
{
    S[x*(n+1) + y] = val;
}

inline void fillRow(std::string& S, int n, int r, int pad = 0) {
    for (int i= pad; i< n-pad; i++) {
        update(S,n, r, i);
    }
}

inline void fillCol(std::string& S, int n, int c, int pad = 0) {
    for (int i= pad; i< n-pad; i++) {
        update(S,n, i, c);
    }
}

std::string zoom(int n)
{
    const int cx = (int)(n / 2);
    
    std::string res = std::string(n * (n+1) - 1, OFF);
    
    // fill endLine
    for (int i=0; i < n - 1; i++) {
        update(res, n, i, n, '\n');
    }
    
    // fill dot
    for (int i=0; i*4 + 1 <=n; i++) {
        
        fillRow(res, n, cx - i*2, cx - 2*i);
        fillRow(res, n, cx + i*2, cx - 2*i);
        fillCol(res, n, cx - i*2, cx - 2*i);
        fillCol(res, n, cx + i*2, cx - 2*i);

    }
    
    
    // Utf8 represent. Since STL treat string as byte
    std::string utf8Str;
    std::string uOff = u8"□";
    std::string uOn = u8"■";
    for (int i=0; i< res.length(); i++) {
        if(res[i] == '0')
            utf8Str.append(uOff);
        else if (res[i] == '1')
            utf8Str.append(uOn);
        else
            utf8Str.append("\n");
    }
    
    return utf8Str;
}

void test() {
    std::cout<< zoom(5) << std::endl;
}
