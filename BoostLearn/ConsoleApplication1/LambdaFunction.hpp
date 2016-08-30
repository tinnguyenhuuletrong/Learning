#ifndef LAMBDA_FUNC_LEARN
#define LAMBDA_FUNC_LEARN

#include "stdafx.h"
#include <functional>
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

	abssort(A, size);

	std::function<float(float)> transform = [](float x) -> float {
		return x * 2; 
	};
	std::cout<< "Reduce Lambda: " << reduce(A, size, transform) << "\n";

}

#endif