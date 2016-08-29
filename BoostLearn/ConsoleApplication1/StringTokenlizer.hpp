#ifndef STRING_TOKENLIZER_LEARN
#define STRING_TOKENLIZER_LEARN

#include "stdafx.h"
#include <boost/tokenizer.hpp>
#include <iostream>

// Boost Tokenlizer
// http://theboostcpplibraries.com/boost.tokenizer
//
void string_tokenlizer() {

	// Tokenlizer
	{
		typedef boost::tokenizer<boost::char_separator<char>> tokenizer;
		std::string s = "Boost C++ Libraries";
		boost::char_separator<char> sep{ " " };
		tokenizer tok{ s, sep };

		for (const auto &t : tok)
			std::cout << t << '\n';
	}

	//CSV
	{
		typedef boost::tokenizer<boost::escaped_list_separator<char>> tokenizer;
		std::string s = "Boost,\"C++ Libraries\"";
		tokenizer tok{ s };

		std::cout << "CSV Formating (escaped_list_separator): " << s;
		for (const auto &t : tok)
			std::cout << t << '\n';
	}

}

#endif