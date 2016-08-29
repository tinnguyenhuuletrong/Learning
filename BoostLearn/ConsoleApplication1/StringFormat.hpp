#ifndef STRING_FORMAT_LEARN
#define STRING_FORMAT_LEARN
#include "stdafx.h"
#include <boost/format.hpp>
#include <string>
#include <iostream>

struct animal
{
	std::string name;
	int legs;
};
std::ostream &operator<<(std::ostream &os, const animal &a)
{
	return os << "animal(" << a.name << ',' << a.legs << ')';
}


// Boost String Format
// http://theboostcpplibraries.com/boost.format
//
void string_format() {
	std::cout << "Boost Format: \t" << boost::format{ "%4%: %1%.%2%.%3%" } % 29 % 8 % 2016 % "Date"<< '\n';

	std::cout << "Printf Format: \t" << boost::format{ "%+d %d %.2f %s" } % 1 % 2 % 1.5 % "string" << '\n';

	animal a{ "cat", 4 };
	std::cout << boost::format{ "Custom Type: \t%1%" } % a << '\n';
}


#endif