from dualdiff.dual import Dual
from plum import dispatch
from typing import Any

def autodifferentiable(f):
    """ Autodifferentiable decorator 
    
    Seamlessly turns a given function 
    f = lambda x: expr(x) 
    into
    f = lambda x: expr(Dual(x, 1)

    How to use it:

    @autodifferentiable
    def f(x : Number):
        ...
    """
    @dispatch
    def decorated(x: Any):
        return f(Dual(x, 1))
    
    @dispatch
    def decorated(x: Dual):
        return f(x)
    
    return decorated