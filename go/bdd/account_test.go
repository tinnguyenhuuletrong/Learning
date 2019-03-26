package bank

import (
	"fmt"

	"github.com/DATA-DOG/godog"
)

var testAccount *account

func iHaveABankAccountWith(amount int) error {
	testAccount = &account{amount}
	return nil
}

func iDeposit(amount int) error {
	testAccount.deposit(amount)
	return nil
}

func itShouldHaveABalanceOf(amount int) error {
	if testAccount.balance == amount {
		return nil
	}
	return fmt.Errorf("Incorrect account balance")
}

func iWithdraw(amount int) error {
	testAccount.withdraw(amount)
	return nil
}

func FeatureContext(s *godog.Suite) {
	s.Step(`^I have a bank account with (\d+)\$$`, iHaveABankAccountWith)
	s.Step(`^I deposit (\d+)\$$`, iDeposit)
	s.Step(`^it should have a balance of (\d+)\$$`, itShouldHaveABalanceOf)
	s.Step(`^I withdraw (\d+)\$$`, iWithdraw)

	s.BeforeScenario(func(interface{}) {
		testAccount = nil
	})
}
