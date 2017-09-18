#include <iostream>
#include <map>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Mix
{
public:
  static map<char, int> process(const std::string &s1);
public:
  static std::string mix(const std::string &s1, const std::string &s2);
};


map<char,int> Mix::process(const std::string &s1) {
    map<char,int> res;
    
    for(auto i : s1) {
        const char key = i;
        
        if(key < 'a' || key > 'z')
            continue;
        
        auto it = res.find(key);
        int count = 0;
        if(it != res.end())
            count = it->second;
        
        res[key] = count + 1;
    }
    
    // trim itm <=1
    for(map<char,int>::iterator i = res.begin(); i != res.end(); i++) {
        if(i->second <=1){
            i = res.erase(i);
            i--;
        }
    }
    
    return res;
}

std::string Mix::mix(const std::string &s1, const std::string &s2)
{
    vector<pair<int, pair<int, string>>> mix;
    
    // mix
    auto tmp = process(s1);
    for(auto i : tmp) {
        mix.push_back(make_pair(i.second, make_pair(1, string(i.second, i.first))));
    }
    
    tmp = process(s2);
    for(auto i : tmp) {
        mix.push_back(make_pair(i.second, make_pair(2, string(i.second, i.first))));
    }
    
    
    // sort
    std::sort(mix.begin(), mix.end(), [ ]( const auto& lhs, const auto& rhs )
    {
        if(lhs.first == rhs.first) {
            return lhs.second.second[0] < rhs.second.second[0];
        }
        return lhs.first > rhs.first;
    });
    
    
    for(auto i : mix) {
        cout << i.first << " " << i.second.first << ":" << i.second.second << endl;
    }
    
    return "";
}

void test() {
    string s1 = "Are the kids at home? aaaaa fffff";
    string s2 = "Yes they are here! aaaaa fffff";
    
    //"=:aaaaaa/2:eeeee/=:fffff/1:tt/2:rr/=:hh"
    cout << Mix::mix(s1,s2) << endl;
}
