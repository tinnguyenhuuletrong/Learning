# https://blog.esciencecenter.nl/automatic-differentiation-from-scratch-23d50c699555

from dualdiff.dual import Dual
import dualdiff.primitives as primitives
from dualdiff.decorators import autodifferentiable

a = Dual(1,2)
b = Dual(a)

print('a=', a)
print('b=', b)
print('a+b=', a + b)
print('a-b=', a + b)
print('a*b=', a * b)
print('a/b=', a / b)

# -> __pow__
print('a^4=', a ** 4)

# -> __rpow__
print('4^a=', 4 ** a) 

print('a^b=', a ** b) 

def f(x):
    return x**3 + x ** 2 + x

x = Dual(3, 1)
res : Dual = f(x)
print("------------------------------")
print("f(x)=x^3 + x ^ 2 + x")
print("f(3) = ", res.x)
print("f'(3) = ", res.dx)


print("------------------------------")
print('cos(a)=', primitives.cos(a)) 
print('sin(a)=', primitives.sin(a)) 
print('tan(a)=', primitives.tan(a)) 
print('exp(a)=', primitives.exp(a)) 

print("------------------------------")
def f2(x):
    return x + primitives.tan(primitives.cos(x)**2 + primitives.sin(x)**2)

x = Dual(0, 1)
res : Dual = f2(x)
print("f2(x)=x + tan(cos(x)^2 + sin(x)^2)")
print("f2(0) = ", res.x)
print("f2'(0) = ", res.dx)



print("------------------------------")

@autodifferentiable
def f3(x):
    return x** 2 - 5*x + 6 - (5*x)**3 - 5 * primitives.exp(-50 * x **2)

res : Dual = f3(0)
print("f3(x)=x^2 - 5x + 6 - 5x^3 - 5 * exp(-50 * x^2)")
print("f3(0) = ", res.x)
print("f3'(0) = ", res.dx)
