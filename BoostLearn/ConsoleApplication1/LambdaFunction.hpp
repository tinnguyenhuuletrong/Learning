#ifndef LAMBDA_FUNC_LEARN
#define LAMBDA_FUNC_LEARN

#include "stdafx.h"
#include <functional>
#include <iostream>
#include <algorithm>
#include <cmath>

//
//	https://msdn.microsoft.com/en-us/library/dd293599.aspx
//

void abssort(float* x, unsigned n) {
	std::sort(x, x + n,
		// Lambda expression begins
		[](float a, float b) {
			return (std::abs(a) < std::abs(b));
		} 
		// end of lambda expression
	);
}

float reduce(float A[], int size, std::function<float(float)> cal) {
	float sum = 0;
	for (int i = 0; i < size; i++) {
		sum += cal(A[i]);
	}
	return sum;
}

void lambda_function() {
	float A[] = { 1.1f, 2.3f, 4.5f, 9.10f, 11.12f };
	int size = 5;
	int closure_count = 0;

	abssort(A, size);

	std::function<float(float)> transform = [&closure_count](float x) -> float {
		closure_count++;
		return x * 2; 
	};

	std::cout<< "Reduce Lambda: " << reduce(A, size, transform) << "\n";
	std::cout << "Closure Count: " << closure_count << "\n";
}


void lambda_closure_ref() {
	using namespace std;

	int i = 3;
	int j = 5;

	// The following lambda expression captures i by value and
	// j by reference.
	function<int(void)> f = [i, &j] { return i + j; };

	// Change the values of i and j.
	i = 22;
	j = 44;

	// Call f and print its result.
	cout << f() << endl;
}

#endif