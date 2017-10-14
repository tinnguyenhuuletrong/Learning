#include <iostream>
using namespace std;

//------------------
//	Predefine
//------------------
struct RegExp{
	// dummy
};

RegExp* normal (char)                     // ^ A character that is not in "()*|."
{
	cout << "normal" << endl;
}
RegExp* any ()                            // ^ Any character
{
	cout << "any" << endl;
}
RegExp* zeroOrMore (RegExp *starred)      // ^ Zero or more occurances of the same regexp
{
	cout << "zeroOrMore" << endl;
}
RegExp* orr (RegExp* left, RegExp* right) // ^ A choice between 2 regexps
{
	cout << "orr" << endl;
}
RegExp* str (RegExp *first)               // ^ A sequence of regexps, first element
{
	cout << "str" << endl;
}
RegExp* add (RegExp *str, RegExp* next)   // ^ A sequence of regexps, additional element
{
	cout << "add" << endl;
}

//------------------
// Code
//------------------


RegExp *parseRegExp (const char *input) {
  return 0;
}

void test() {
    
}
//https://www.codewars.com/kata/regular-expression-parser

// Ref
// https://github.com/eliben/code-for-blog/blob/master/2009/regex_fsm/regex_parse.cpp
//
// The BNF for our simple regexes is:
//
// expr     ::= concat '|' expr
//          |   concat
//
// concat   ::= rep . concat
//          |   rep
//
// rep      ::= atom '*'
//          |   atom '?'
//          |   atom
//
// atom     ::= chr
//          |   '(' expr ')'
//
// char     ::= alphanumeric character
//

