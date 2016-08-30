#ifndef CONTAINER_LEARN
#define CONTAINER_LEARN

#include "stdafx.h"
#include <boost/heap/priority_queue.hpp>
#include <boost/circular_buffer.hpp>
#include <boost/multi_index_container.hpp>
#include <boost/multi_index/hashed_index.hpp>
#include <boost/multi_index/member.hpp>
#include <boost/bimap.hpp>

#include <iostream>

//  The container is similar to std::map, but supports looking up values from either side
//	http://theboostcpplibraries.com/boost.bimap
//
void bidirection_map() {
	typedef boost::bimap<std::string, int> bimap;
	bimap animals;

	animals.insert({ "cat", 4 });
	animals.insert({ "shark", 0 });
	animals.insert({ "spider", 8 });

	std::cout << "Bimap search left: " << animals.left.find("cat")->second << '\n';
	std::cout << "Bimap search right: " << animals.right.find(8)->second << '\n';
}

//	Boost.MultiIndex makes it possible to define containers that support an arbitrary number of interfaces
//	http://theboostcpplibraries.com/boost.multiindex
//
void multi_index_map() {


	using namespace boost::multi_index;

	struct animal
	{
		std::string name;
		int legs;
	};

	typedef multi_index_container<
		animal,
		indexed_by<
			hashed_non_unique<
				member< animal, std::string, &animal::name >
			>,
			hashed_non_unique<
				member< animal, int, &animal::legs >
			>
		>
	> animal_multi;

	animal_multi animals;

	animals.insert({ "cat", 4 });
	animals.insert({ "shark", 0 });
	animals.insert({ "spider", 8 });
	animals.insert({ "spider red", 8 });

	std::cout << animals.count("cat") << '\n';

	const animal_multi::nth_index<1>::type &legs_index = animals.get<1>();
	std::cout << legs_index.count(8) << '\n';
}

//	Continuous data flow where old data becomes irrelevant as new data becomes available. Memory is automatically reused by overwriting old data.
//	http://theboostcpplibraries.com/boost.circularbuffer
//
void circular_buffer() {

	typedef boost::circular_buffer<int> circular_buffer;
	circular_buffer cb(3);

	std::cout << "capacity: " << cb.capacity() << '\n';
	std::cout << "size 1: " << cb.size() << '\n';

	cb.push_back(0);
	cb.push_back(1);
	cb.push_back(2);

	std::cout << "size 2: " << cb.size() << '\n';

	cb.push_back(3);
	cb.push_back(4);

	std::cout << "size 3: " << cb.size() << '\n';

	std::cout << "memory data: ";

	for (int i : cb)
		std::cout << i << ',';

	std::cout << '\n';
}




template <typename T>
struct LargestOnTop
{
	bool operator() (const T & lhs, const T & rhs) const
	{
		return lhs < rhs;
	}
};

template <typename T>
struct SmallestOnTop
{
	bool operator() (const T & lhs, const T & rhs) const
	{
		return lhs > rhs;
	}
};

//	Heap
//	http://theboostcpplibraries.com/boost.heap
//
void heap() {

	using namespace boost::heap;

	{
		std::cout << "Heap SmallestOnTop: " << "\n";
		priority_queue<int, boost::heap::compare<SmallestOnTop<int>>> pq;
		pq.push(2);
		pq.push(3);
		pq.push(1);

		for (int i : pq)
			std::cout << i << '\n';
	}

	{
		std::cout << "Heap LargestOnTop: " << "\n";
		priority_queue<int, boost::heap::compare<LargestOnTop<int>>> pq;
		pq.push(2);
		pq.push(3);
		pq.push(1);

		for (int i : pq)
			std::cout << i << '\n';
	}
	
}

#endif