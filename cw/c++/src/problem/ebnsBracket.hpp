#include <string>
#include <iostream>
#include <vector>
using namespace std;

// Does the std::string str conform to the
// context-free language of the empty string
// or, nested, matching lists of []?
//
// Return true if the grammar accepts the string,
// and false if the grammar rejects the string.

// Extended Backus-Naur Form of the context-sensitive grammar:
// Grammar         = { Brackets } ;
// Brackets     = '[' , { Brackets } , ']';

bool accepts(std::vector<char> &tokens, char validChar) {
    if(tokens.size() <= 0) return false;
    
    char top = *tokens.begin();
    if(top == validChar){
        tokens.erase(tokens.begin());
        return true;
    }
    return false;
}

bool brackets(vector<char> &tokens) {
    bool hasBegin = accepts(tokens, '[');
    if(!hasBegin) return false;
    
    // zero or more bracket
    while(brackets(tokens)){};
    
    if( accepts(tokens, ']') ) return true;
    
    // insert back
    tokens.insert(tokens.begin(), '[');
    
    return false;
}

bool gramma( std::vector<char> &tokens) {
    // { Brackets }
    // zero or one brackets
    while (brackets(tokens)) {};
    return tokens.size() <= 0;
}

bool accept_string(std::string str) {
    std::vector<char> tokens;
    std::copy( str.begin(), str.end(), std::back_inserter(tokens));
    
    return gramma(tokens);
}


void test() {
    
    cout << accept_string("") << endl;
    cout << accept_string("[][]") << endl;
    cout << accept_string("[[][][][][]]") << endl;
    cout << accept_string("[[[[]]]]") << endl;
    cout << accept_string("[[[[]]]]]") << endl;
    
    cout << accept_string("[") << endl;
}
