use adder_lib_with_test::*;

mod common;

#[test]
fn larger_can_hold_smaller() {
  common::setup();
  let larger = Rectangle {
    width: 8,
    height: 7,
  };
  let smaller = Rectangle {
    width: 5,
    height: 1,
  };

  assert!(larger.can_hold(&smaller));
}

#[test]
fn smaller_cannot_hold_larger() {
  common::setup();
  let larger = Rectangle {
    width: 8,
    height: 7,
  };
  let smaller = Rectangle {
    width: 5,
    height: 1,
  };

  assert!(!smaller.can_hold(&larger));
}

#[test]
fn it_adds_two() {
  common::setup();
  assert_eq!(
    4,
    add_two(2),
    // Error message
    "2 + 2 -> `{}`",
    4
  );
}

#[test]
#[should_panic]
fn guess_invalid_input() {
  common::setup();
  Guess::new(200);
}
