from plum import dispatch
from numbers import Number
from numpy import log

class Dual:

    @dispatch
    def __init__(self, x: Number, dx: Number = 0):
        """ Basic constructor """
        self.x = x
        self.dx = dx

    @dispatch
    def __init__(self, z: "Dual"):
        """ Additional constructor
        If the input is already a dual number, just return it.
        This will be handy later for seamlessly coercing any 
        number into a dual 
        """
        self.x = z.x
        self.dx = z.dx

    def __str__(self):
        """ Pretty print object """
        return "Dual({0}, {1})".format(self.x, self.dx)

    def __repr__(self):
        """ Official string representation """
        return self.__str__()
    
    def __float__(self):
        """ 'Return as float' operator """
        return float(self.x)
    
    def __eq__(self, other):
        """ Equality operator """
        other = Dual(other)  # Coerce into dual
        return all([self.x == other.x, self.dx == other.dx])
    
    def __ne__(self, other):
        """ Inequality operator """
        other = Dual(other)  # Coerce into dual
        return not self == other
    
    def __gt__(self, other):
        """ 'Greater than' operator """
        other = Dual(other)  # Coerce into dual
        return self.x > other.x

    def __ge__(self, other):
        """ 'Greater or equal than' operator """
        other = Dual(other)  # Coerce into dual
        return self.x >= other.x

    def __lt__(self, other):
        """ 'Lesser than' operator """
        other = Dual(other)  # Coerce into dual
        return self.x < other.x

    def __le__(self, other):
        """ 'Lesser or equal than' operator """
        other = Dual(other)  # Coerce into dual
        return self.x <= other.x
    
    def __abs__(self):
        """ Absolute value operator """
        return abs(self.x)
    
    def __add__(self, other):
        """ Left-side addition operator """
        other = Dual(other) # Coerce into dual
        y = self.x + other.x
        dy = self.dx + other.dx
        return Dual(y, dy)
    
    def __radd__(self, other):
        """ Right-side addition operator """
        return self + other
    
    def __iadd__(self, other):
        """ += operator """ #TODO: this seems to not be necessary
        return self + other

    def __neg__(self):
        """ Negation operator """
        y = -self.x
        dy = -self.dx
        return Dual(y, dy)
    
    def __pos__(self):
        """ Positive operator """
        return self
    
    def __sub__(self, other):
        """ Left-side subtraction operator """
        other = Dual(other)  # Coerce into dual
        return self + (-other)
    
    def __rsub__(self, other):
        """ Right-side subtraction operator """
        return other + (-self)
    
    def __mul__(self, other):
        """ Left-side multiplication operator """
        other = Dual(other)  # Coerce into dual
        y = self.x * other.x
        dy = self.dx * other.x + self.x * other.dx # Product rule for derivatives
        return Dual(y, dy)
    
    def __rmul__(self, other):
        """ Right-side multiplication operator """
        return self * other # Identical to __mul__ due to conmutative property
    
    def __truediv__(self, other):
        """ Left-side division operator """
        other = Dual(other)  # Coerce into dual
        y = self.x / other.x
        dy = (self.dx * other.x - self.x * other.dx) / other.x**2
        return Dual(y, dy)
    
    def __rtruediv__(self, other):
        """ Right-side division operator """
        return other / self

    @dispatch
    def __pow__(self, other : Number):
        """ Power operator """
        y = self.x ** other
        # Apply the rule for differentiating powers
        # Don't forget the chain rule!
        dy = other * self.x ** (other - 1) * self.dx 
        return Dual(y, dy)
    
    @dispatch
    def __rpow__(self, other : Number):
        """ Power operator """
        y = other ** self.x
        # Apply the rule for differentiating exponentials
        # Don't forget the chain rule!
        dy = other ** self.x * log(other) * self.dx
        return Dual(y, dy)
    
    @dispatch
    def __pow__(self, other: "Dual"):
        """ Power operator """
        # General derivative of f(x)^g(x)
        # Will return complex numbers for f(x) < 0
        y = self.x ** other.x
        dy = self.x ** other.x * log(self.x) * other.dx + other.x * self.x ** (other.x - 1) * self.dx
        return Dual(y, dy)
    
    @dispatch
    def __rpow__(self, other: "Dual"):
        """ Power operator """
        return other ** self
    
    #TODO: unify the four above
    #TODO: check __complex__ dunder