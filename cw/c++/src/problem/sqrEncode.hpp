#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <regex>
#include <cmath>

class CodeSqStrings
{
public:
    static std::string code(const std::string &strng);
    static std::string decode(const std::string &strng);
};

const char PADDING_CHAR = '\013';

std::string CodeSqStrings::code(const std::string &strng) {
    
    std::string input(strng);
    
    unsigned int n = ceil(sqrt((input.length())));
    std::regex r("(.{" + std::to_string(n) + "})", std::regex_constants::extended);
    
    // padding char 11
    std::string sqrString = input.append( fmax(n*n - input.length(), 0), PADDING_CHAR);
    
    // split every n char
    std::vector<std::string> tokens;
    std::smatch sm;
    while(std::regex_search(sqrString, sm, r))
    {
        tokens.push_back(sm[0]);
        sqrString = sm.suffix();
    }
    
    // rotate clockwise 90
    std::string res;
    for (unsigned i =0; i<n; i++) {
        for (unsigned j=0; j<n; j++) {
            res.append(&tokens[n-j-1][i], 1);
        }
        if(i<n-1)
            res.append("\n");
    }
    
    return res;
}

std::string CodeSqStrings::decode(const std::string &strng) {
    std::stringstream ss;
    ss.str(strng);
    std::string item;
    std::vector<std::string> tokens;
    while (std::getline(ss, item, '\n')) {
        tokens.push_back(item);
    }
    
    int n = tokens.size();
    std::string res;
    for (unsigned i =0; i<n; i++) {
        for (unsigned j=0; j<n; j++) {
            if(((int)tokens[j][n - i - 1]) != PADDING_CHAR)
                res.append(&tokens[j][n - i - 1], 1);
        }
    }

    
    return res;
}


void test() {
    std::string inp = "What do you remember? When I looked at his streaky glasses, I wanted "
    "to leave him. And before that? He stole those cherries for me at midnight. We were walking "
    "in the rain and I loved him. And before that? I saw him coming "
    "toward me that time at the picnic, edgy, foreign.";
    std::string out = CodeSqStrings::code(inp);
    std::cout << "Encode: " <<out << std::endl;
    std::string decode = CodeSqStrings::decode(out);
    std::cout << "Decode: " <<decode << std::endl;
}
