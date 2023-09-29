# https://leetcode.com/problems/print-zero-even-odd/

import threading
from typing import Callable

class ZeroEvenOdd:
    def __init__(self, n):
        self.n = n
        self.i = 1
        self.step = 0
        self.con = threading.Condition()
        
        
	# printNumber(x) outputs "x", where x is an integer.
    def zero(self, printNumber: 'Callable[[int], None]') -> None:
        while True:
            with self.con:                
                self.con.wait_for(lambda : self.step == 0)
                if self.i > self.n:
                    break
                printNumber(0)
                if self.i %2 == 0:
                    self.step = 2
                else:
                    self.step = 1
                self.con.notify_all()
                
        
        
        
    def odd(self, printNumber: 'Callable[[int], None]') -> None:
        while True:
            with self.con:
                self.con.wait_for(lambda : (self.step == 1 or self.i > self.n))
                if self.i > self.n:
                    self.step = 0
                    self.con.notify_all()
                    break
                printNumber(self.i)
                self.step = 0
                self.i+=1
                self.con.notify_all()

         
    def even(self, printNumber: 'Callable[[int], None]') -> None:
        while True:
            with self.con:
                self.con.wait_for(lambda : (self.step == 2 or self.i > self.n))
                if self.i > self.n:
                    self.step = 0
                    self.con.notify_all()
                    break
                printNumber(self.i)
                self.step = 0
                self.i+=1
                self.con.notify_all()
            


n = 5
ins = ZeroEvenOdd(n)


def t_zero():
    ins.zero(lambda x : print(x,end=''))

def t_odd():
    ins.odd(lambda x: print(x,end=''))

def t_even():
    ins.even(lambda x: print(x,end=''))

t1 = threading.Thread(target= t_zero)
t2 = threading.Thread(target= t_odd)
t3 = threading.Thread(target= t_even)

t1.start()
t2.start()
t3.start()