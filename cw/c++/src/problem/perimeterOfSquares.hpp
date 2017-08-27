#include <functional>
#include <algorithm>
#include <iostream>
#include <map>

using namespace std;
typedef unsigned long long ull;
class SumFct
{
  public:
  static ull perimeter(int n) {
      ull sum = 0;
      for (int i=1; i<=n+1; i++) {
          sum += fibonaci(i);
      }
      
      return sum * 4;
  }

  static ull fibonaci(int n) {
      if(n==1 || n == 2)
          return 1;
      
      auto cache = memCache.find(n);
      if(cache != memCache.end())
          return (*cache).second;
      
      auto res = fibonaci(n-1) + fibonaci(n-2);
      
      memCache[n] = res;
      
      return res;
  }

  private:
  static std::map<ull, ull> memCache;

};
std::map<ull, ull> SumFct::memCache = std::map<ull,ull>();

void test() {
    cout << SumFct::perimeter(5) << endl;
    cout << SumFct::perimeter(7) << endl;
    cout << SumFct::perimeter(20) << endl;
    cout << SumFct::perimeter(30) << endl;
}
