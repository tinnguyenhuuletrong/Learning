Feature: Getting Start
  Tutorial cucumbers market

  Scenario: Enough money
    Given I have 42 cucumbers in my bag
    Given I have 10 USD in my bag
    Given 1.0 cucumber = 5.0 USD
    When I sell 1 cucumbers -> success
    When I buy 2 cucumbers -> success
    Then I have 43 cucumbers in my bag

  Scenario: Not Enough money
    Given I have 42 cucumbers in my bag
    Given I have 10 USD in my bag
    Given 1.0 cucumber = 5.0 USD
    When I sell 1 cucumbers -> success
    When I buy 20 cucumbers -> failed

  Scenario: Not Enough money because price inc
    Given I have 42 cucumbers in my bag
    Given I have 10 USD in my bag
    Given 1.0 cucumber = 5.0 USD
    When I sell 1 cucumbers -> success
    Given 1.0 cucumber = 10.0 USD
    When I buy 2 cucumbers -> failed
