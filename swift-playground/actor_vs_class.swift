// Material
// https://medium.com/appcent/understanding-swift-actors-ec9e18aaceba
// https://medium.com/@valentinjahanmanesh/swift-actors-in-depth-19c8b3dbd85a

import Foundation


// Swift Actors will ensure that only one piece of code interacts with it at given time.
actor EmployeeActor {
    private var salary: Int = 100
    
    func increaseSalary(increase: Int) {
        print("-----> Actor increaseSalary begin \(increase)")
        usleep(1000)
        salary += increase
        print("-----> Actor increaseSalary end")
    }
    
    func getSalary() -> Int {
        print(".-----> Actor getSalary begin \(salary)")
        usleep(1000)
        print("-----> Actor getSalary end \(salary)")
        return salary
    }
}

// Class is not ensure that -> race condition may be have
class EmployeeClass {
    private var salary: Int = 100
    
    func increaseSalary(increase: Int) {
        print("-----> Class increaseSalary begin \(increase)")
        usleep(1000)
        salary += increase
        print("-----> Class increaseSalary end")
    }
    
    func getSalary() -> Int {
        print("-----> Class getSalary begin \(salary)")
        usleep(1000)
        print("-----> Class getSalary end \(salary)")
        return salary
    }
}

print("------------------------------------")
print("\tEmployeeActor")
print("------------------------------------")

let employeeActor = EmployeeActor()        
await withTaskGroup(of: Void.self ) {group in 
  group.addTask {
    await increaseSalaryAsyncActor(employee: employeeActor, increase: 50).value
  }
  group.addTask{
    await increaseSalaryAsyncActor(employee: employeeActor, increase: 100).value
  }
  await group.waitForAll()
}

func increaseSalaryAsyncActor(employee: EmployeeActor, increase: Int) -> Task<Void, Never> {
    return Task {
        print("Inc salary Actor: \(increase)")
        await employee.increaseSalary(increase: increase)
        
        let newSalary = await employee.getSalary()
        print("New salary Actor: \(newSalary)")
    }
}

print("------------------------------------")
print("\tEmployeeClass")
print("------------------------------------")


let employeeClass = EmployeeClass()
        
await withTaskGroup(of: Void.self ) {group in 
  group.addTask {
    await increaseSalaryAsyncClass(employee: employeeClass, increase: 50).value
  }
  group.addTask{
    await increaseSalaryAsyncClass(employee: employeeClass, increase: 100).value
  }
  await group.waitForAll()
}


func increaseSalaryAsyncClass(employee: EmployeeClass, increase: Int) -> Task<Void, Never> {
    Task {
        print("Inc salary Class: \(increase)")
        employee.increaseSalary(increase: increase)
        
        let newSalary = employee.getSalary()
        print("New salary Class: \(newSalary)")
    }
}



/*
> swift actor_vs_class.swift

------------------------------------
  EmployeeActor
------------------------------------
Inc salary Actor: 50
-----> Actor increaseSalary begin 50
Inc salary Actor: 100
-----> Actor increaseSalary end
.-----> Actor getSalary begin 150
-----> Actor getSalary end 150
New salary Actor: 150
-----> Actor increaseSalary begin 100
-----> Actor increaseSalary end
.-----> Actor getSalary begin 250
-----> Actor getSalary end 250
New salary Actor: 250
------------------------------------
  EmployeeClass
------------------------------------
Inc salary Class: 100
-----> Class increaseSalary begin 100
Inc salary Class: 50
-----> Class increaseSalary begin 50
-----> Class increaseSalary end
-----> Class getSalary begin 200
-----> Class increaseSalary end
-----> Class getSalary begin 250
-----> Class getSalary end 250
New salary Class: 250
-----> Class getSalary end 250
New salary Class: 250

*/