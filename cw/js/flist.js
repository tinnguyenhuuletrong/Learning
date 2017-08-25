function List() {}

function EmptyList() {}
EmptyList.prototype = new List();
EmptyList.prototype.constructor = EmptyList;

EmptyList.prototype.toString = function(begin = '(', end =')') { return begin + end };
EmptyList.prototype.isEmpty = function() { return true };
EmptyList.prototype.length = function() { return 0 };
EmptyList.prototype.push = function(x) { return new ListNode(x, this) };
EmptyList.prototype.remove = function(x) { return this };
EmptyList.prototype.append = function(xs) {  return xs };

function ListNode(value, next) { 
	this.value = value
	this.next = next
}
ListNode.prototype = new List();
ListNode.prototype.constructor = ListNode;
ListNode.prototype.isEmpty = function() { return this.next == null };

ListNode.prototype.toString = function(begin = '(', end =')') { 
	const seperator = this.next.isEmpty() ? '' : ' '
	return begin + this.value + seperator + this.next.toString('', '') + end
};

ListNode.prototype.head = function() { return this.value };
ListNode.prototype.tail = function() { return this.next };
ListNode.prototype.length = function() { return 1 + this.next.length() };
ListNode.prototype.push = function(x) { return new ListNode(x, this) };
ListNode.prototype.remove = function(x) { 
	let tmp = this.next.remove(x)
	if(this.value == x)		  // Skip this node
		return tmp
	else if(this.next == tmp) // nothing change
		return this
	else {
		return new ListNode(this.value, tmp)
	}
};
ListNode.prototype.append = function(xs) { 	return new ListNode(this.value, this.next.append(xs)) };

// var list0 = new EmptyList();        // => "()"
// var list1 = list0.push(3);          // => "(3)"
// var list2 = list1.push(2);          // => "(2 3)"
// var list3 = list2.push(1);          // => "(1 2 3)"
// var list13 = list1.append(list3);   // => "(3 1 2 3)"

// console.log(list13.toString())
// console.log(list3)

mt = new EmptyList();
l0 = mt.push('a')
l1 = l0.push('b')
l2 = l0.push('c')
l3 = l2.append(l1)

console.log(l1.toString(), l2.toString(), l3.toString())

l4 = l3.remove('c')
console.log(l4.toString(), l4.tail() === l1)

// mt = new EmptyList();
// l0 = mt.push('a')
// l1 = l0.push('b')
// l2 = l0.push('c')
// l3 = l2.append(l1)

// console.log(l1.toString(), l2.toString(), l3.toString())

// l4 = l3.remove('b')
// console.log(l4.toString(), l4.tail() === l1)



// Test.describe("Example list tests", function () {
//   var mt, l1, l2, l3, l4;
  
//   Test.before( function () {
//     mt = new EmptyList();
//     l1 = mt.push('c').push('b').push('a');
//     l2 = l1.append(l1);
//     l3 = l1.remove('b');
//     l4 = l2.remove('b');
//   });
    
//   Test.it( "Simple checks", function () {
//     Test.expect(mt.isEmpty(), "Empty List is empty");
//     Test.expect( !l1.isEmpty(), "Non-empty list is not empty");
//     Test.expect(mt.toString() === "()", "()");
//     Test.expect(l3.toString() === "(a c)", "(a c)");
//     Test.expect(mt.length() === 0, "Empty list has length zero");
//     Test.expect(l1.length() === 3, "(a b c) length 3");
//   });
    
//   Test.it( "Shared structure", function () {
//     Test.expect(l2.tail().tail().tail() === l1, "(a b c a b c) shares");
//     Test.expect(l2 !== l1, "(a b c a b c) doesn't share too much");
//     Test.expect(l3.tail() === l1.tail().tail(), "(a b c) remove b shares c");
//   });
// });