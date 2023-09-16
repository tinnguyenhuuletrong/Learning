# https://leetcode.com/problems/print-foobar-alternately/

import threading

class FooBar:
    def __init__(self, n):
        self.n = n
        self.step = 0
        self.con = threading.Condition()

    def foo(self, printFoo: "Callable[[], None]") -> None:
       for i in range(self.n):
           with self.con:
               self.con.wait_for(lambda: self.step == 0)
               printFoo()
               self.step = 1
               self.con.notify(1)


    def bar(self, printBar: "Callable[[], None]") -> None:
       for i in range(self.n):
           with self.con:
               self.con.wait_for(lambda: self.step == 1)
               printBar()
               self.step = 0
               self.con.notify(1)


n = 1000
ins = FooBar(n)

def t_foo():
    ins.foo(lambda : print("foo"))

def t_bar():
    ins.bar(lambda : print("bar"))

t1 = threading.Thread(target= t_foo)
t2 = threading.Thread(target= t_bar)

t1.start()
t2.start()