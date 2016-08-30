#ifndef LAMBDA_FUNC_LEARN
#define LAMBDA_FUNC_LEARN

#include "stdafx.h"
#include <iostream>
#include <algorithm>
#include <cmath>

void abssort(float* x, unsigned n) {
	std::sort(x, x + n,
		// Lambda expression begins
		[](float a, float b) {
			return (std::abs(a) < std::abs(b));
		} 
		// end of lambda expression
	);
}

void lambda_function() {
	float A[] = { 1.1, 2.3, 4.5 };

	abssort(A, 3);
}

#endif