#include <iostream>
#include <string>
#include <regex>
#include <cmath>

class CodeSqStrings
{
public:
    static std::string code(const std::string &strng);
    static std::string decode(const std::string &strng);
    
private:
    static unsigned int nearestSquareLenge(unsigned int len);

};

unsigned int CodeSqStrings::nearestSquareLenge(unsigned int len) {
    return ceil(sqrt(len));
}

std::string CodeSqStrings::code(const std::string &strng) {
    
    std::string input(strng);
    
    unsigned int n = nearestSquareLenge(input.length());
    std::regex r("(.{" + std::to_string(n) + "})");
    
    std::string sqrString = input.append( fmax(n*n - input.length(), 0), (char)11);
    sqrString = std::regex_replace (sqrString,r,"$1\n");
    
    std::cout << sqrString << std::endl;
    
    std::string res;
    
    
	return "";
}

std::string CodeSqStrings::decode(const std::string &strng) {
	return "";
}


void test() {
    std::string inp = "I.was.going.fishing.that.morning.at.ten.o'clock";
    CodeSqStrings::code(inp);
}
