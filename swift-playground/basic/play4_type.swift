class MediaItem {
    var name: String
    init(name: String) {
        self.name = name
    }
}

class Movie: MediaItem {
    var director: String
    init(name: String, director: String) {
        self.director = director
        super.init(name: name)
    }
}

class Song: MediaItem {
    var artist: String
    init(name: String, artist: String) {
        self.artist = artist
        super.init(name: name)
    }
}

let library = [
    Movie(name: "Casablanca", director: "Michael Curtiz"),
    Song(name: "Blue Suede Shoes", artist: "Elvis Presley"),
    Movie(name: "Citizen Kane", director: "Orson Welles"),
    Song(name: "The One And Only", artist: "Chesney Hawkes"),
    Song(name: "Never Gonna Give You Up", artist: "Rick Astley")
]

func doStats(_ library: [MediaItem]) -> (movieCount: Int, songCount: Int) {
  var movieCount = 0
  var songCount = 0


  for item in library {
      if item is Movie {
          movieCount += 1
      } else if item is Song {
          songCount += 1
      }
  }
  return (movieCount, songCount)
}

func doPrint(_ library: [MediaItem]) {
  print("Library len: ",library.count)
  for item in library {
    if let movie = item as? Movie {
        print("\t Movie: \(movie.name), dir. \(movie.director)")
    } else if let song = item as? Song {
        print("\t Song: \(song.name), by \(song.artist)")
    }
  }
}

doPrint(library)
let (movieCount, songCount) = doStats(library)
print("Stats:\n movieCount: \(movieCount), songCount: \(songCount)")


// Type Any
var things: [Any] = []
things.append(999)
things.append(0.0)
things.append(42)
things.append(3.14159)
things.append("hello")
things.append((3.0, 5.0))
things.append(Movie(name: "Ghostbusters", director: "Ivan Reitman"))
things.append({ (name: String) -> String in "Hello, \(name)" })
things.append((a: 1, b:2))

print(things)
for thing in things {
    switch thing {
    case 999 as Int:
        print("Int === 999")
    case 0 as Double:
        print("Double === 0")
    case let someInt as Int:
        print("an integer value of \(someInt)")
    case let someDouble as Double where someDouble > 0:
        print("a positive double value of \(someDouble)")
    case is Double:
        print("some other double value that I don't want to print")
    case let someString as String:
        print("a string value of \"\(someString)\"")
    case let (x, y) as (Double, Double):
        print("an (x, y) point at \(x), \(y)")
    case let movie as Movie:
        print("a movie called \(movie.name), dir. \(movie.director)")
    case let stringConverter as (String) -> String:
        print(stringConverter("Michael"))
    default:
        print("something else")
    }
}