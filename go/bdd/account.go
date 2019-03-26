package bank

type account struct {
	balance int
}

func (a *account) withdraw(amount int) {
	a.balance = a.balance - amount
}

func (a *account) deposit(amount int) {
	a.balance = a.balance + amount
}
