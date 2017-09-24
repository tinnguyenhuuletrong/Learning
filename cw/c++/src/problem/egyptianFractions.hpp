#include <string>
#include <vector>
#include <iostream>
using namespace std;

class Decomp
{
private:
    static vector<string> res;
    static void greedyEgyptian(int nr, int dr);
public:
  static string decompose(const string &nrStr, const string &drStr);
};

vector<string> Decomp::res;

string Decomp::decompose(const string &nrStr, const string &drStr)
{
    int nr = stoi(nrStr);
    int dr = stoi(drStr);
    res.clear();
    
    greedyEgyptian(nr, dr);
    
    string output = "[";
    int len = res.size();
    
    if(res.size() == 0)
        return "[]";
        
    for (int i=0; i < len; i++) {
        if(i != len - 1)
            output += res[i] + ", ";
        else
            output += res[i] + "]";
    }
    return output;
}

void Decomp::greedyEgyptian(int nr, int dr)
{
    // If either numerator or denominator is 0
    if (dr == 0 || nr == 0)
        return;
 
    // If numerator divides denominator, then simple division
    // makes the fraction in 1/n form
    if (dr%nr == 0)
    {
        res.push_back("1/" + to_string(dr/nr));
        return;
    }
 
    // If denominator divides numerator, then the given number
    // is not fraction
    if (nr%dr == 0)
    {
        res.push_back(to_string(nr/dr));
        return;
    }
 
    // If numerator is more than denominator
    if (nr > dr)
    {
        res.push_back(to_string(nr/dr));
        greedyEgyptian(nr%dr, dr);
        return;
    }
 
    // We reach here dr > nr and dr%nr is non-zero
    // Find ceiling of dr/nr and print it as first
    // fraction
    int n = dr/nr + 1;
    res.push_back("1/" + to_string(n));
 
    // Recur for remaining part
    greedyEgyptian(nr*n-dr, dr*n);
 }


void test() {

    //[1/84, 1/27055, 1/1359351420]
    cout << Decomp::decompose("50", "4187");
}
