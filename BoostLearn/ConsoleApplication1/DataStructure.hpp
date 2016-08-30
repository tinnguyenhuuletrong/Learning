#ifndef DATA_STRUCTURE_LEARN
#define DATA_STRUCTURE_LEARN

#include "stdafx.h"
#include <boost/optional.hpp>
#include <boost/optional/optional_io.hpp>

#include <cstdlib>
#include <ctime>
#include <cmath>
#include <string>
#include <iostream>
#include <tuple>

//	Tuple Value for Packed and Unpacked
//	http://theboostcpplibraries.com/boost.tuple or http://en.cppreference.com/w/cpp/utility/tuple
//
void std_tuple() {

	std::tuple<int, float, std::string> tp = std::make_tuple(1, 10.5f, "hello");

	int a;
	float b;
	std::string c;

	std::tie(a, b, c) = tp;


	std::cout << "Tuple Unpacked: " << a << "," << b << "," << c << "\n";
}


boost::optional<int> get_even_random_number()
{
	int i = std::rand();
	return (i % 2 == 0) ? i : boost::optional<int>{};
}

//	Boost Optional
//	http://theboostcpplibraries.com/boost.optional
//
void boost_option() {
	std::srand(static_cast<unsigned int>(std::time(0)));
	boost::optional<int> i = get_even_random_number();
	std::cout << "Boost Option: " << (bool)i << "\n";
	if (i)
		std::cout << std::sqrt(static_cast<float>(*i)) << '\n';
}


#endif