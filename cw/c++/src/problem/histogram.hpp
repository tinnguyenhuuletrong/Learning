#include <string>
#include <vector>
#include <iostream>
using namespace std;

std::string & rtrim(std::string & str)
{
    auto it1 =  std::find_if( str.rbegin() , str.rend() , [](char ch){ return !std::isspace<char>(ch , std::locale::classic() ) ; } );
    str.erase( it1.base() , str.end() );
    return str;
}

std::string histogram(std::vector<int> results)
{
    vector<string> lines = {"1 2 3 4 5 6", "-----------"};
    
    int level = 1;
    while(true) {
        bool hasChange = false;
        string line = "";
        for(auto i : results) {
            if(i >= level){
                line += "# ";
                hasChange = true;
            }
            else if(i + 1 == level && i > 0) {
                string tmp = to_string(i);
                line += tmp + (tmp.length() < 2 ? " " : "");
            }
            else
                line += "  ";
        }
        level++;
        line = rtrim(line);
        if(line.length() > 0)
            lines.push_back(line);
        if(!hasChange) break;
    }
    
    string strRes = "";
    int len = lines.size();
    for (int i = len - 1; i >= 0; i--) {
        strRes += lines[i] + "\n";
    }
    return strRes;
}

void test() {
    cout << histogram({ 4, 6, 10, 13, 7, 10 });
}
