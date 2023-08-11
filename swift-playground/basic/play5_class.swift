struct BlackjackCard {


  // nested Suit enumeration
  enum Suit: Character {
      case spades = "♠", hearts = "♡", diamonds = "♢", clubs = "♣"
  }


  // nested Rank enumeration
  enum Rank: Int {
      case two = 2, three, four, five, six, seven, eight, nine, ten
      case jack, queen, king, ace
      struct Values {
          let first: Int, second: Int?
      }
      var values: Values {
          switch self {
          case .ace:
              return Values(first: 1, second: 11)
          case .jack, .queen, .king:
              return Values(first: 10, second: nil)
          default:
              return Values(first: self.rawValue, second: nil)
          }
      }
  }


  // BlackjackCard properties and methods
  let rank: Rank, suit: Suit
  var description: String {
      var output = "suit is \(suit.rawValue),"
      output += " value is \(rank.values.first)"
      if let second = rank.values.second {
          output += " or \(second)"
      }
      return output
  }
}


// latter on .... extend
extension BlackjackCard {
    static let theTwoOfSpades = BlackjackCard(rank: .two, suit: .spades)
}

let theAceOfSpades = BlackjackCard(rank: .ace, suit: .spades)
print("theAceOfSpades:",theAceOfSpades.description)
print("theTwoOfSpades:",BlackjackCard.theTwoOfSpades.description)
print("heartsSymbol:", BlackjackCard.Suit.hearts.rawValue)


extension Double {
    var km: Double { return self * 1_000.0 }
    var m: Double { return self }
    var cm: Double { return self / 100.0 }
    var mm: Double { return self / 1_000.0 }
    var ft: Double { return self / 3.28084 }
}
let oneKm = 1.km
print("oneKm: \(oneKm)m")
print("42.km + 195.m = \(42.km + 195.m)m")


extension Int {
    func repetitions(task: () -> Void) {
        for _ in 0..<self {
            task()
        }
    }
}

3.repetitions {
    print("hit")
}

extension Int {
    enum Kind {
        case negative, zero, positive
    }
    var kind: Kind {
        switch self {
        case 0:
            return .zero
        case let x where x > 0:
            return .positive
        default:
            return .negative
        }
    }
}
print("1_00: ", 1_00.kind)
print("-3: ",(-3).kind)
print("0", 0.kind)