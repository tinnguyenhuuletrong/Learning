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
    
    map<char,int> trimRes;
    
    // trim itm <=1
    for(map<char,int>::iterator i = res.begin(); i != res.end(); i++) {
        if(i->second > 1){
            trimRes[i->first] = i->second;
        }
    }
    
    return trimRes;
}

std::string Mix::mix(const std::string &s1, const std::string &s2)
{
    vector<string> mix;
    
    // mix
    auto tmp1 = process(s1);
    for(auto i : tmp1) {
        string val = "1:" + string(i.second, i.first);
        mix.push_back(val);
    }
    
    auto tmp2 = process(s2);
    for(auto i : tmp2) {
        string val = string(i.second, i.first);
        auto combineItm = find(mix.begin(), mix.end(), "1:" + val);
        if(combineItm != mix.end())
        {
            *combineItm = "=:" + val;
        }
        else
        {
            auto score1 = tmp1.find(i.first);
            
            // does not exit in S1
            if(score1 == tmp1.end())
            {
                mix.push_back("2:" + val);
            }
            // Exit both S1 and S2 AND frequency S2 larger
            else if(score1->second < i.second)
            {
                auto prev = find(mix.begin(), mix.end(), "1:" + string(score1->second, i.first));
                mix.erase(prev);
                mix.push_back("2:" + val);
            }
        }
    }
    
    
    // sort
    std::sort(mix.begin(), mix.end(), [ ]( const auto& lhs, const auto& rhs )
    {
        if(lhs.length() == rhs.length())
        {
            return lhs < rhs;
        }
        return lhs.length() > rhs.length();
    });
    
    
    // build res
    string res = "";
    for (int i = 0; i < mix.size(); i++) {
        res += mix[i];
        if(i!= mix.size() - 1)
            res += "/";
    }
    
    return res;
}

void test() {
    string s1 = "Are they here";
    string s2 = "yes, they are here";
    
    //"=:aaaaaa/2:eeeee/=:fffff/1:tt/2:rr/=:hh"
    cout << Mix::mix(s1,s2) << endl;
}
