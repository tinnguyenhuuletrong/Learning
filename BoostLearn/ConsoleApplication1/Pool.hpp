#ifndef POOL_LEARN
#define POOL_LEARN

#include "stdafx.h"
#include <boost\pool\simple_segregated_storage.hpp>
#include <boost\pool\object_pool.hpp>

#include <vector>
#include <cstddef>
#include <iostream>

// 
// Memory Pool Segment Managerment. 
// Note:
//		+ You usually don’t use boost::simple_segregated_storage directly. Boost.Pool provides other classes that allocate memory automatically without requiring you to allocate memory yourself and pass it to boost::simple_segregated_storage.
//
void basic_segment_pool()
{
	// Allocated Memory
	std::vector<char> v(1024);

	boost::simple_segregated_storage<std::size_t> storage;
	
	// Let memory managed by boost segment, each block size 256 => 4 blocks in total
	storage.add_block(&v.front(), v.size(), 256);

	// Get 1 block
	int *i = static_cast<int*>(storage.malloc());
	*i = 1;

	std::cout << *i << '\n';

	// Get n continuous block
	int *j = static_cast<int*>(storage.malloc_n(1, 512));
	j[10] = 2;

	std::cout << *j << '\n';

	// Free
	storage.free(i);
	storage.free_n(j, 1, 512);
}

// 
// Memory Pool for sepecific object type
//
void object_pool() {

	// Allocate 32 Block of Int, Max size 0 => Double block allocated after full filled ( 64, 128, ... )
	boost::object_pool<int> pool(32, 0);

	int *i = pool.malloc();
	*i = 1;
	
	std::cout << *i;

	int *j = pool.construct(2);
	std::cout << *j;

	int *k = pool.construct(5);
	std::cout << *k;

	pool.destroy(i);
	pool.destroy(j);
	pool.destroy(k);
}

#endif