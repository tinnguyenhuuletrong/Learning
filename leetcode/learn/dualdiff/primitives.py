from typing import Any
import numpy as np
from plum import dispatch
from dualdiff.dual import Dual

def _factory(f, df):
    """ Factory for Dual representation of primitives

    Implement chain rule
        F(u, u') = (F(u), F'(u) * u')
    
    Many of the functions below have the structure:
    
    def operator(z: Dual):
        y = foo(z.x)
        dy = dfoo(z.x) * z.dx # Chain rule
        return Dual(y, dy)

    This factory method simplifies the input to:

    def operator(z: Dual):
        aux = _factory(<fun>, <derivative>)
        return aux(z)

    and reduces the chances of introducing bugs (typically
    from forgetting to add the chain rule)

    Usage:
        sin(u, u') = (sin(u), cos(u) * u')
    sin(Dual) = _factory(sin,cos)

    """
    return lambda z: Dual(f(z.x), df(z.x) * z.dx)



# Trigonometric functions
@dispatch
def sin(x: Any):
    return np.sin(x)

@dispatch
def sin(z: Dual): 
    aux = _factory(np.sin, # Function
                   np.cos) # Derivative
    return aux(z)


@dispatch
def cos(x: Any):
    return np.cos(x)

@dispatch
def cos(z: Dual):
    aux = _factory(np.cos,                  # Function
                   lambda x: -np.sin(x))    # Derivative
    return aux(z)


@dispatch
def tan(x: Any):
    return sin(x) / cos(x) # We can build functions from their primitives


# Exponential
@dispatch
def exp(x: Any):
    return np.exp(x)

@dispatch
def exp(z: Dual):
    return np.exp(1) ** z