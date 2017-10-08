#include <vector>
#include <string>
#include <iostream>
#include <sstream>
using namespace std;


void split(const std::string &s, char delim, vector<string> &result) {
    std::stringstream ss;
    ss.str(s);
    std::string item;
    while (std::getline(ss, item, delim)) {
        result.push_back(item);
    }
}

long long score(const string &itm) {
    long long res = 0;
    for(auto i : itm) {
        res += (i - '0');
    }
    return res;
}

namespace Closest
{
    std::vector<std::tuple<int, unsigned int, long long>> closest(const std::string &strng)
    {
        std::vector<std::tuple<int, unsigned int, long long>> res;
        vector<string> tokens;
        
        split(strng, ' ', tokens);
        vector<std::tuple<long long, string, int>> data;
        
        // preprocess Data
        int index = 0;
        for(auto i : tokens) {
            data.push_back({
                score(i),
                i,
                index++
            });
        }
        
        // sort
        std::sort(data.begin(), data.end(), [](auto a, auto b) {
            long long score1 = get<0>(a);
            long long score2 = get<0>(b);
            int index1 = get<2>(a);
            int index2 = get<2>(b);
            
            if(score1 == score2)
                return index1 < index2;
            
            return score1 < score2;
        });
        
        for(auto i : data) {
            cout << get<0>(i) << " : " << get<1>(i) << " : " << get<2>(i) << endl;
        }
        
        
        int len = data.size();
        int diff = INT_MAX;
        int indexDistance = INT_MAX;
        int smalestWeight = INT_MAX;
        std::tuple<long long, string, int> a, b;
        
        for(int i=0; i< len -1; i++) {
            long long score1 = get<0>(data[i]);
            long long score2 = get<0>(data[i+1]);
            int index1 = get<2>(data[i]);
            int index2 = get<2>(data[i + 1]);
            
            int tmpDiff = abs(score1 - score2);
            int tmpIndexDiff = abs(index1 - index2);
            
            //with the smallest weights
            if(tmpDiff < diff) {
                diff = tmpDiff;
                indexDistance = tmpIndexDiff;
                a = data[i];
                b = data[i+1];
                smalestWeight = score1;
            }
        }
        
        res.push_back({
            get<0>(a),
            get<2>(a),
            atoll(get<1>(a).c_str())
        });
        res.push_back({
            get<0>(b),
            get<2>(b),
            atoll(get<1>(b).c_str())
        });
        
        cout << diff << endl;
        cout << get<0>(res[0]) << " : " << get<1>(res[0]) << " : " << get<2>(res[0]) << endl;
        cout << get<0>(res[1]) << " : " << get<1>(res[1]) << " : " << get<2>(res[1]) << endl;
        cout << endl;
        return res;
    }
    
}

void test() {
	std::string s = "103 123 4444 99 2000";
    Closest::closest(s);

    cout << endl;
    s = "80 71 62 53";
    Closest::closest(s);

    cout << endl;
    s = "444 2000 445 544";
    Closest::closest(s);
    
    cout << endl;
    s = "241259 154 155206 194 180502 147 300751 200 406683 37 57";
    Closest::closest(s);
    
    
}
