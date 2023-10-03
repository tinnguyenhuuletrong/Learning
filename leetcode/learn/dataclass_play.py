from dataclasses import dataclass

# All options
# https://docs.python.org/3/library/dataclasses.html#module-contents
@dataclass(init=True, repr=True)
class InventoryItem:
    """Class for keeping track of an item in inventory."""
    name: str
    unit_price: float
    quantity_on_hand: int = 0

    def total_cost(self) -> float:
        return self.unit_price * self.quantity_on_hand
    


ins = InventoryItem(name="Name", unit_price=1.0, quantity_on_hand=1)
print(ins)