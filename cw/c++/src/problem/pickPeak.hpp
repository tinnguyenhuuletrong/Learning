#include <iostream>
#include <vector>

using namespace std;

//----------------------------------//
struct PeakData {
  vector<int> pos, peaks;
};
//----------------------------------//

PeakData pick_peaks(vector<int> v) {
    PeakData result;
    result.pos.clear();
    result.peaks.clear();
    
    int len = v.size();
    
    for(auto i : v) {
        cout <<i<< ", ";
    }
    cout << endl;
    
    for (int i = 1; i < len - 1; ++i)
    {
        if(v[i] > v[i-1] && v[i] >= v[i+1]) {
            int begin = i;
            int val = v[i];
            while( i < len && v[i] == val) i++;
            if( i < len && val > v[i]) {
                result.pos.push_back(begin);
                result.peaks.push_back(v[begin]);
                cout << begin << ":" << v[begin] << endl;
            }
        }
    }
    cout << endl;
    return result;
}

void test() {
    
    pick_peaks(vector<int> {3, 2, 3, 6, 4, 1, 2, 3, 2, 1, 2, 3});
    pick_peaks({1, 2, 2, 2, 1});
    pick_peaks({1, 2, 2, 2, 3});
    pick_peaks({2, 1, 3, 1, 2, 2, 2, 2, 1});
    pick_peaks({2, 1, 3, 1, 2, 2, 2, 2});
    pick_peaks({2, 1, 3, 2, 2, 2, 2, 1});
}
