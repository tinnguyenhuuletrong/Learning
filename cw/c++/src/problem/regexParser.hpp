//------------------ 
//	Predefine
//------------------
struct RegExp;

RegExp* any ();
RegExp* normal (char c);
RegExp* zeroOrMore (RegExp *starred);
RegExp* orr (RegExp *left, RegExp *right);
RegExp* str (RegExp *first);
RegExp* add (RegExp *str, RegExp *next);

//------------------
// Code
//------------------

#include <iostream>
using namespace std;

RegExp *parseRegExp (const char *input) {
  return 0;
}



void test() {
    
}
//https://www.codewars.com/kata/regular-expression-parser

// Ref
// https://github.com/eliben/code-for-blog/blob/master/2009/regex_fsm/regex_parse.cpp
