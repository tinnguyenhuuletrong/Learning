#ifndef STRING_BASIC_LEARN
#define STRING_BASIC_LEARN
#include "stdafx.h"
#include <boost/algorithm/string.hpp>
#include <boost/lexical_cast.hpp>
#include <string>
#include <iostream>

// Boost String Algorithms
// http://theboostcpplibraries.com/boost.stringalgorithms
//
void string_algorithm() {
	using namespace boost::algorithm;

	std::string s = "Boost C++ Libraries";
	std::string upper_case1 = to_upper_copy(s);
	std::string lower_case2 = to_lower_copy(s);

	std::cout << "Input: \t" << s << '\n';

	std::cout << "to_upper_copy: \t" << upper_case1 << '\n';
	std::cout << "to_lower_copy: \t" << lower_case2 << '\n';

	std::cout << "erase_first_copy: \t" << erase_first_copy(s, "s") << '\n';
	std::cout << "erase_nth_copy: \t" << erase_nth_copy(s, "s", 0) << '\n';
	std::cout << "erase_last_copy: \t" << erase_last_copy(s, "s") << '\n';
	std::cout << "erase_all_copy: \t" << erase_all_copy(s, "s") << '\n';
	std::cout << "erase_head_copy: \t" << erase_head_copy(s, 5) << '\n';
	std::cout << "erase_tail_copy: \t" << erase_tail_copy(s, 9) << '\n';

	std::cout << "starts_with: \t" << starts_with(s, "Boost") << '\n';
	std::cout << "ends_with: \t" << ends_with(s, "Libraries") << '\n';
	std::cout << "contains: \t" << contains(s, "C++") << '\n';
	std::cout << "lexicographical_compare: \t" << lexicographical_compare(s, "Boost") << '\n';

	std::vector<std::string> v;
	split(v, s, is_space());
	std::cout << "split by ' ': \n";
	for (auto i = v.begin(); i != v.end(); ++i)
		std::cout << *i << "\n";
}

//  Convert String To Num
//	http://theboostcpplibraries.com/boost.lexical_cast
//
void string_convert() {

	std::cout << "stoi: " << std::stoi("123") * 2<< '\n';
	std::cout << "lexical_cast<int>: " << boost::lexical_cast<int>("123") + 1<< '\n';

	std::cout << "stod: " << std::stod("123.1") * 2 << '\n';
	std::cout << "lexical_cast<double>: " << boost::lexical_cast<double>("123.2") + 1 << '\n';

	try
	{
		int i = boost::lexical_cast<int>("abc");
		std::cout << i << '\n';
	}
	catch (const boost::bad_lexical_cast &e)
	{
		std::cerr << "lexical_cast exception: " << e.what() << '\n';
	}
}


#endif