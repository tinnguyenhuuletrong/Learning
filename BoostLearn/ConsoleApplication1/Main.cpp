// Main.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

#include "Utils.hpp"
#include "ShareAndWeakPtr.hpp"
#include "BoostMemory.hpp"


void line_break(std::string name = "") {
	std::cout << "\n---" << name << "---" << '\n';
}

int main()
{
	line_break("scope_ptr");
	scope_ptr();

	line_break("scope_array_ptr");
	scope_array_ptr();

	line_break("share_ptr");
	share_ptr();

	line_break("share_weak_ptr");
	runShareAndWeakLearn();

	line_break("scope_exit");
	scope_exit();

    return 0;
}

