#include <iostream>
using namespace std;

//------------------
//	Predefine
//------------------
struct RegExp{
	// dummy
};

RegExp* normal (char c)                     // ^ A character that is not in "()*|."
{
    auto ins = new RegExp();
	cout << "normal(" << c << ")" << ins << endl;
    return ins;
}
RegExp* any ()                            // ^ Any character
{
	cout << "any" << endl;
    return new RegExp();
}
RegExp* zeroOrMore (RegExp *starred)      // ^ Zero or more occurances of the same regexp
{
	cout << "zeroOrMore" << endl;
    return new RegExp();
}
RegExp* orr (RegExp* left, RegExp* right) // ^ A choice between 2 regexps
{
	cout << "orr" << endl;
    return new RegExp();
}
RegExp* str (RegExp *first)               // ^ A sequence of regexps, first element
{
    auto ins = new RegExp();
	cout << "str " << first << " -> " << ins << endl;
    return ins;
}
RegExp* add (RegExp *str, RegExp* next)   // ^ A sequence of regexps, additional element
{
    auto ins = new RegExp();
    cout << "add: " << str << " + " << next << " = " << ins << endl;
    return ins;
}

//------------------
// Code
//------------------

//
// A singleton scanner class, encapsulates the input stream
//
class Scanner
{
public:
    void init(string data_)
    {
        data = preprocess(data_);
        next = 0;
    }

    char peek(void)
    {
        return (next < data.size()) ? data[next] : 0;
    }

    char pop(void)
    {
        char cur = peek();

        if (next < data.size())
            ++next;

        return cur;
    }

    unsigned get_pos(void)
    {
        return next;
    }
    
    void raiseError(bool res) {
        error = res;
    }
    
    bool hasError() { return error; }

    friend Scanner& GetScanner(void);

private:
    Scanner()
    {
        error = 0;
    }

    string preprocess(string in);

    string data;
    unsigned next;
    bool error;
};

bool isalnumOrAny(char chr) {
    return isalnum(chr)
    || chr == '.'; // Any char
}


// Generates concatenation chars ('!') where
// appropriate
//
string Scanner::preprocess(string in)
{
    if(in.length() == 0)
        return "";
    
    string out = "";

    string::const_iterator c = in.begin(), up = c + 1;

    // in this loop c is the current char of in, up is the next one
    //
    for (; up != in.end(); ++c, ++up)
    {
        out.push_back(*c);

        if ((isalnumOrAny(*c) || *c == ')' || *c == '*' || *c == '?')
            && (*up != ')' && *up != '|' && *up != '*' && *up != '?'))
            out.push_back('!');
    }

    // don't forget the last char ...
    //
    if (c != in.end())
        out.push_back(*c);

    return out;
}


Scanner& GetScanner(void)
{
    static Scanner my_scan;
    return my_scan;
}



typedef enum {CHR, STAR, QUESTION, ALTER, CONCAT} node_type;

// Parse node
//
struct ParseNode
{
    ParseNode(node_type type_, char data_, ParseNode* left_, ParseNode* right_)
    : type(type_), data(data_), left(left_), right(right_)
    {}
    
    bool isLeaf() { return left == NULL && right == NULL; }
    
    node_type type;
    char data;
    ParseNode* left;
    ParseNode* right;
};

ParseNode* atom();
ParseNode* chr();
ParseNode* concat();
ParseNode* expr();
ParseNode* rep();


// char   ::= alphanumeric character
//
ParseNode* chr()
{
    Scanner& scanner = GetScanner();
    char data = scanner.peek();
    
    if (isalnumOrAny(data) || data == 0)
    {
        return new ParseNode(CHR, scanner.pop(), 0, 0);
    }
    
    cerr     << "Parse error: expected alphanumeric, got "
    <<  scanner.peek() << " at #" << scanner.get_pos() << endl;
    return NULL;
}

// atom ::= chr
//      |   '(' expr ')'
//
ParseNode* atom()
{
    Scanner& scanner = GetScanner();
    ParseNode* atom_node = NULL;
    
    if (scanner.peek() == '(')
    {
        scanner.pop();
        atom_node = expr();
        
        if (scanner.pop() != ')')
        {
            scanner.raiseError(true);
        }
    }
    else
    {
        atom_node = chr();
    }
    
    return atom_node;
}

// rep  ::= atom '*'
//      |   atom '?'
//      |   atom
//
ParseNode* rep()
{
    Scanner& scanner = GetScanner();
    ParseNode* atom_node = atom();
    if(atom_node == NULL)
        return NULL;
    if (scanner.peek() == '*')
    {
        scanner.pop();
        
        ParseNode* rep_node = new ParseNode(STAR, 0, atom_node, 0);
        return rep_node;
    }
    else if (scanner.peek() == '?')
    {
        scanner.pop();
        
        ParseNode* rep_node = new ParseNode(QUESTION, 0, atom_node, 0);
        return rep_node;
    }
    else
    {
        return atom_node;
    }
}

// concat   ::= rep . concat
//          |   rep
//
ParseNode* concat()
{
    Scanner& scanner = GetScanner();
    ParseNode* left = rep();
    
    if (scanner.peek() == '!')
    {
        scanner.pop();
        ParseNode* right = concat();
        
        ParseNode* concat_node = new ParseNode(CONCAT, 0, left, right);
        return concat_node;
    }
    else
    {
        return left;
    }
}

// expr ::= concat '|' expr
//      |   concat
//
ParseNode* expr(void)
{
    Scanner& scanner = GetScanner();
    ParseNode* left = concat();
    
    if (scanner.peek() == '|')
    {
        scanner.pop();
        ParseNode* right = expr();
        
        ParseNode* expr_node = new ParseNode(ALTER, 0, left, right);
        return expr_node;
    }
    else
    {
        return left;
    }
}

void print_tree(ParseNode* node, unsigned offset)
{
    if (!node)
        return;
    
    for (unsigned i = 0; i < offset; ++i)
        cout << " ";
    
    switch (node->type)
    {
        case CHR:
            cout << node->data;
            break;
        case ALTER:
            cout << '|';
            break;
        case CONCAT:
            cout << '!';
            break;
        case QUESTION:
            cout << '?';
            break;
        case STAR:
            cout << '*';
            break;
        default:
            break;
    }
    
    cout << endl;
    
    print_tree(node->left, offset + 4);
    print_tree(node->right, offset + 4);
}


RegExp * outputCall(ParseNode* node, RegExp * parent = NULL) {
    if (!node)
        return NULL;
   
    switch (node->type)
    {
        case CHR:
        {
            if(node->data == 0)
                return NULL;
            if(node->data == '.')
                return any();
            return normal(node->data);
        }
        case ALTER:
        {
            auto right = outputCall(node->right);
            auto left = outputCall(node->left);
            return orr(left, right);
        }
        case CONCAT:
        {
            auto left = outputCall(node->left);
            auto tmp = str(left);
            auto right = outputCall(node->right);
            return add(tmp, right);
        }
        case STAR:
        {
           return zeroOrMore(outputCall(node->left));
        }
//        case QUESTION:
//            cout << '?';
//            break;
        default:
            return NULL;
    }
    
}

RegExp *parseRegExp (const char *input) {
    Scanner& scanner = GetScanner();
    scanner.raiseError(false);
    scanner.init(input);
    if(scanner.hasError())
        return NULL;
    ParseNode* n = expr();
    if(!n) return NULL;
    print_tree(n, 0);
    return outputCall(n, NULL);
}

void test() {
    //parseRegExp("((a.)|.b)*|a");     //any ('.')
//    parseRegExp("a");     //(normal ('a')
//    parseRegExp("ab");    //add (str (normal ('a')), normal ('b'))
//    parseRegExp("ab*");   //add (str (normal ('a')), zeroOrMore (normal ('b')))
//    parseRegExp("(ab)*"); //zeroOrMore (add (str (normal ('a')), normal ('b')))
//    parseRegExp("a|b*");    //orr (normal ('a'), zeroOrMore (normal ('b')))
//    parseRegExp("(a|b)*");    //zeroOrMore (orr (normal ('a'), normal ('b')))
//    parseRegExp("a.*");    //add (str (normal ('a')), zeroOrMore (any ()))
    parseRegExp("abcd");     //add(add(add(str(normal('a')), normal('b')), normal('c')), normal('d'));
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
// concat   ::= rep ! concat
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

