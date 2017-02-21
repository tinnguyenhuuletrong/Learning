namespace Bank
{
    using System;

    public class InsufficientFundsException : ApplicationException
    {
        
    }

    public class Account
    {
        private decimal balance;

        public void Deposit(decimal amount)
        {
            balance += amount;
        }

        public void Withdraw(decimal amount)
        {
            balance -= amount;
        }

        public void TransferFunds(Account destination, decimal amount)
        {
            if(balance-amount < minimumBalance) 
                throw new InsufficientFundsException();

            destination.Deposit(amount);

            Withdraw(amount);
        }

        public decimal Balance
        {
            get { return balance; }
        }

        private decimal minimumBalance = 10m;

        public decimal MinimumBalance
        {
            get{ return minimumBalance; }
        }
    }
}