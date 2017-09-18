#include <cmath>
#include <iostream>
using namespace std;

class ArcParabLen
{
public:
    static double lenCurve(int n);
};

double eulerDistance(double x1, double y1, double x2, double y2) {
	double dx = (x1 - x2);
	double dy = (y1 - y2);
	return sqrt(dx*dx + dy*dy);
}

double ArcParabLen::lenCurve(int n) {
	double steps = 1.0 / n;
	double length = 0;
	double px = 0;
	double py = 0;
	for (int i = 0; i < n; ++i)
	{
		double x = px + steps;
		double y = x * x;

		length += eulerDistance(px, py, x, y);

		px = x;
		py = y;
	}
	return length;
}

void test() {
    cout << ArcParabLen::lenCurve(10) << endl;
}
