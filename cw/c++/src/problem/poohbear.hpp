#include <iostream>
#include <list>
#include <stack>
#include <cmath>
#include <string>
using namespace std;

class CellDatas {
public:
    CellDatas() {
        mCells.push_back(0);
        current = mCells.begin();
    };
    
    void addVal(int val) {
        *current = (*current + val) % 256;
        if(*current < 0)
            *current += 256;
    }
    
    void mulVal(int val) {
        *current = (*current * val) % 256;
        if(*current < 0)
            *current += 256;
    }
    
    void divVal(int val) {
        *current = ((int)(*current / val)) % 256;
        if(*current < 0)
            *current += 256;
    }
    
    void squareVal() {
        *current = (*current * *current) % 256;
        if(*current < 0)
            *current += 256;
    }
    
    void squareRootVal() {
        *current = ((int)sqrt(*current)) % 256;
        if(*current < 0)
            *current += 256;
    }
    
    void moveLeft() {
        if(current == mCells.begin())
            mCells.push_front(0);
        current--;
    }
    
    void moveRight() {
        if(current == --mCells.end())
            mCells.push_back(0);
        current++;
    }
    
    void copy() {
        buffer = *current;
    }
    
    void paste() {
        *current = buffer;
    }
    
    int currentVal() {
        return *current;
    }
    
    unsigned char currentAscii() {
        return *current;
    }
    
    int clipboard() {
        return buffer;
    }
private:
    
    unsigned char buffer;
    list<unsigned char>::iterator current;
    list<unsigned char> mCells;
};

const char *poohbear (const char* sourcecode) {
    string res;
    unique_ptr<CellDatas> state = make_unique<CellDatas>();
    stack<int> callStack;
    
    int len = strlen(sourcecode);
    for (int i=0; i< len; i++) {
        char op = sourcecode[i];
        
        switch (op) {
            case 'P':
                res.push_back(state->currentAscii());
                break;
            case 'N':
                res += to_string(state->currentVal());
                break;
            case '+':
                state->addVal(1);
                break;
            case '-':
                state->addVal(-1);
                break;
            case 'L':
                state->addVal(2);
                break;
            case 'I':
                state->addVal(-2);
                break;
            case 'V':
                state->divVal(2);
                break;
            case 'T':
                state->mulVal(2);
                break;
            case 'Q':
                state->squareVal();
                break;
            case 'U':
                state->squareRootVal();
                break;
            case '>':
                state->moveRight();
                break;
            case '<':
                state->moveLeft();
                break;
            case 'c':
                state->copy();
                break;
            case 'p':
                state->paste();
                break;
            case 'A':
                state->addVal(state->clipboard());
                break;
            case 'B':
                state->addVal(-state->clipboard());
                break;
            case 'Y':
                state->mulVal(state->clipboard());
                break;
            case 'D':
                state->divVal(state->clipboard());
                break;
            case 'E':
            {
                if(callStack.size() <=0) break;
                i = callStack.top();
                callStack.pop();
                op = sourcecode[i];
            }
            case 'W':
            {
                int currentVal = state->currentVal();
                if(currentVal == 0) {
                    while(i< len && sourcecode[i] != 'E') i++;
                    break;
                }
                
                callStack.push(i);
                break;
            }
            default:
                break;
        }
    }
    
    char* buffer = new char[res.length() + 1];
    memset(buffer, 0, res.length() + 1);
    memcpy(buffer, res.c_str(), res.length());
    return buffer;
}

void test() {
//    cout << poohbear("++c>p++N") << endl;
//    cout << poohbear ("") << endl;  //, "");
//    cout << poohbear ("N") << endl; //, "0");
//    cout << poohbear ("N+N") << endl; //, "01");
//    cout << poohbear ("LTTLN") << endl; //, "10");
//    cout << poohbear ("LTTLQN") << endl;  //, "100");
//    cout << poohbear ("LQQT+P") << endl;  //, "!");
//    cout << poohbear ("LQTcQAP>pQBBTAI-PA-PPL+P<BVPAL+T+P>PL+PBLPBP<DLLLT+P") << endl;  //, "Hello World!");
//    cout << poohbear ("LQQT+P+P+P+P+P+P") << endl;  //, "!\"#$%&");
//    cout << poohbear("+c BANANA") << endl; // 12
//    cout << poohbear("+W+EN") << endl; // 0
//    cout << poohbear("+LTQII>+WN<P>+E") << endl;
}


//Command    Definition
//+    Add 1 to the current cell
//-    Subtract 1 from the current cell
//>    Move the cell pointer 1 space to the right
//<    Move the cell pointer 1 space to the left
//c    "Copy" the current cell
//p    Paste the "copied" cell into the current cell
//W    While loop - While the current cell is not equal to 0
//E    Closing character for loops
//P    Output the current cell's value as ascii
//N    Output the current cell's value as an integer
//T    Multiply the current cell by 2
//Q    Square the current cell
//U    Square root the current cell's value
//L    Add 2 to the current cell
//I    Subtract 2 from the current cell
//V    Divide the current cell by 2
//A    Add the copied value to the current cell's value
//B    Subtract the copied value from the current cell's value
//Y    Multiply the current cell's value by the copied value
//D    Divide the current cell's value by the copied value.

