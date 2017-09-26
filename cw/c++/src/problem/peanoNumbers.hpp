#include <iostream>
#include <type_traits>
using namespace std;

// ---------------------------
// These are preloaded.
// ---------------------------

struct Peano {
};

struct Zero: Peano {
  static constexpr int value = 0;
};

template<class T>
struct Succ: Peano {
  static constexpr int value = T::value + 1;
};

struct Error {};
struct NoError : Error {};
struct Negative : Error {};
struct Infinity : Error {};

struct Ordreing {};
struct EQ: Ordreing {};
struct GT: Ordreing {};
struct LT: Ordreing {};

struct Bool {};
struct True: Bool {};
struct False: Bool {};

// ---------------------------
// Test
// ---------------------------

template<int v>
struct peano {
  using type = Succ<typename peano<v - 1>::type>;
};

template<>
struct peano<0> {
  using type = Zero;
};

// ---------------------------
// Implementation
// ---------------------------

template<class T1, class T2>
struct Add {
	static constexpr int value = T1::value + T2::value;
};

template<class T1, class T2>
struct Sub;

template<class T1, class T2>
struct Mul;

template<class T1, class T2>
struct Div;

template<class T>
struct Even;

template<class T>
struct Odd;

template<class T1, class T2>
struct Compare;

void test() {
	cout << Zero::value << endl;
	cout << Succ<Zero>::value << endl;
	cout << Succ<Succ<Zero>>::value << endl;

	cout << "-----------------------" << endl;	

	//cout << Add<peano<1>::type, peano<1>::type>::type << endl;

	cout << std::is_same< Add< peano<1>::type, peano<1>::type >::type, peano<2>::type >::value
}