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

static constexpr int DivOrDefault(int a, int b)
{
    if (b == 0) return 1024;
    return a/b;
}

static constexpr bool isEven(int a) {
    return (a%2) == 0;
}

static constexpr int compare(int a, int b) {
    if(a == b) return 0;
    if(a< b) return 1;
    return 2;
}

static constexpr int myMax(int a, int b) {
    return a > b ? a : b;
}


template<int v>
struct Dummypeano {
    using type = Succ<typename Dummypeano<v - 1>::type>;
};

template<>
struct Dummypeano<0> {
    using type = Zero;
};

template<>
struct Dummypeano<1024> {
    using type = Infinity;
};

template<bool b>
struct NegativeCheck {
    using type = NoError;
};

template<>
struct NegativeCheck<true> {
    using type = Negative;
};

template<>
struct NegativeCheck<false> {
    using type = NoError;
};

template<bool b>
struct EvenCheck {
    using type = True;
};

template<>
struct EvenCheck<false> {
    using type = False;
};

template<>
struct EvenCheck<true> {
    using type = True;
};

template<int b>
struct CompareCheck {
    using type = EQ;
};

template<>
struct CompareCheck<1> {
    using type = LT;
};

template<>
struct CompareCheck<2> {
    using type = GT;
};

template<>
struct CompareCheck<0> {
    using type = EQ;
};

template<class T1, class T2>
struct Add {
    using type = typename Dummypeano<T1::value + T2::value>::type;
};

template<class T1, class T2>
struct Sub {
    using type = typename Dummypeano<myMax(T1::value - T2::value,0)>::type;
    using error = typename NegativeCheck<T1::value < T2::value>::type;
};

template<class T1, class T2>
struct Mul {
    using type = typename Dummypeano<T1::value * T2::value>::type;
};

template<class T1, class T2>
struct Div {
    using type = typename Dummypeano<DivOrDefault(T1::value,T2::value)>::type;
    using error = typename Dummypeano<DivOrDefault(T1::value,T2::value)>::type;
};

template<class T>
struct Even {
    using type = typename EvenCheck<isEven(T::value)>::type;
};

template<class T>
struct Odd {
  using type = typename EvenCheck<!isEven(T::value)>::type;
};

template<class T1, class T2>
struct Compare{
    using type = typename CompareCheck<compare(T1::value, T2::value)>::type;
};

void test() {
	cout << Zero::value << endl;
	cout << Succ<Zero>::value << endl;
	cout << Succ<Succ<Zero>>::value << endl;

	cout << "-----------------------" << endl;

    cout << std::is_same<
                 Add<peano<1>::type, peano<1>::type>::type,
                 peano<2>::type
    >::value;
    
    cout << endl;
    
    cout << std::is_same<
                 Sub<peano<1>::type, peano<1>::type>::type,
                 peano<0>::type
                 >::value;
    
    cout << endl;
    
    cout << std::is_same<
        Sub<peano<1>::type, peano<2>::type>::error,
        Negative
        >::value;
    
    cout << endl;
    
    cout << std::is_same<
        Mul<peano<1>::type, peano<2>::type>::type,
        peano<2>::type
        >::value;
    
    cout << endl;
    
    cout<< std::is_same<
        Mul<peano<3>::type, peano<4>::type>::type,
        peano<12>::type
        >::value;
    
    cout << endl;
    
    cout << std::is_same<
        Div<peano<3>::type, peano<2>::type>::type,
        peano<1>::type
        >::value;
    
    cout << endl;
    
    cout << std::is_same<
        Div<peano<4>::type, peano<0>::type>::error,
        Infinity
        >::value;
    
    cout << "-----" << endl;
    
    cout << std::is_same<
    Even<peano<0>::type>::type,
    True
    >::value;
    
    cout << endl;
    
    cout << std::is_same<
    Odd<peano<0>::type>::type,
    False
    >::value;
    
    cout << endl;
    
    cout << std::is_same<
    Compare<peano<0>::type, peano<0>::type>::type,
    struct EQ
    >::value;
    
    cout << endl;
    
    cout << std::is_same<
    Compare<peano<0>::type, peano<1>::type>::type,
    struct LT
    >::value;
    
    cout << endl;
    
    cout << std::is_same<
    Compare<peano<1>::type, peano<0>::type>::type,
    struct GT
    >::value;
    
}
