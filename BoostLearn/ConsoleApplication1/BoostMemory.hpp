#ifndef BOOST_MEMORY_MANAGERMENT_LEARN
#define BOOST_MEMORY_MANAGERMENT_LEARN
#include "stdafx.h"

#include <boost\scoped_ptr.hpp>
#include <boost\scoped_array.hpp>
#include <boost\shared_ptr.hpp>
#include <boost\scope_exit.hpp>

#include <iostream>

// 
// Pointer can't share owner (ref) and scoped variable life time
//
void scope_ptr() {
	boost::scoped_ptr<int> p{ new int{ 1 } };
	std::cout << *p << '\n';
	p.reset(new int{ 2 });
	std::cout << *p.get() << '\n';
	p.reset();
	std::cout << std::boolalpha << static_cast<bool>(p) << '\n';
}

// 
// Array Pointer can't share owner (ref) and scoped variable life time
//
void scope_array_ptr() {
	boost::scoped_array<int> p{ new int[2] };
	*p.get() = 1;
	std::cout << p[0] << '\t' << p[1] << '\n';
	p[1] = 2;
	std::cout << p[0] << '\t' << p[1] << '\n';
	p.reset(new int[3]);
	std::cout << p[0] << '\t' << p[1] << '\n';

}

// 
//	Most Commonly userd
//	Pointer Can be ref and auto deleted when ref count down to 0
//
void share_ptr() {
	boost::shared_ptr<int> p1{ new int{ 1 } };
	std::cout << *p1 << '\n';
	boost::shared_ptr<int> p2{ p1 };
	p1.reset(new int{ 2 });
	std::cout << *p1.get() << '\n';
	p1.reset();

	int a = p1.use_count();
	int b = p2.use_count();

	std::cout << std::boolalpha << static_cast<bool>(p2) << '\n';
}

// 
//	Scope memory macro
//
int* scope_exit_func() {
	int *i = new int{ 10 };
	BOOST_SCOPE_EXIT(&i)
	{
		delete i;
		i = 0;
	} BOOST_SCOPE_EXIT_END
		std::cout << *i << '\n';
	return i;
}

void scope_exit() {
	int *j = scope_exit_func();

	// j deleted by scope
	std::cout << j << '\n';
}

#endif