// Freestanding macros appear on their own, without being attached to a declaration.
func myFunction() {
    print("Currently running name is \(#function)")
    #warning("Something's wrong")
}

// Attached macros modify the declaration that they’re attached to.
// @Observable
// public final class MyObject {
//     public var someProperty: String = ""
//     public var someOtherProperty: Int = 0
//     fileprivate var somePrivateProperty: Int = 1
// }

myFunction()
