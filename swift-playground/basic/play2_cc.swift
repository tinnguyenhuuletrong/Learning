
// Swift guarantees that only code inside an actor can access the actor’s local state
//  the actor allows only one task at a time to access its mutable state, 
//  if code from another task is already interacting with the logger, this code suspends while it waits to access the property.
actor TemperatureLogger {
    let label: String
    var measurements: [Int]
    private(set) var max: Int
    private(set) var stopped: Bool


    init(label: String, measurement: Int) {
        self.label = label
        self.measurements = [measurement]
        self.max = measurement
        self.stopped = false
    }
}

extension TemperatureLogger {
    func update(with measurement: Int) {
        measurements.append(measurement)
        if measurement > max {
            max = measurement
        }
    }

    func shutdown() {
      self.stopped = true
    }
}


func mainOnlyUseTask() async {
  let logger = TemperatureLogger(label: "Outdoors", measurement: 25)

  let taskUpdate = Task {
    for _ in 1...100 {
      let val = Int.random(in: 1...1000)
      await logger.update(with: val)
      print("updated ", val)
      try await Task.sleep(nanoseconds: 1000000)
    }

    await logger.shutdown()
  }

  let taskSensor = Task {
    while !(await logger.stopped) {
      let currentMaxVal = await logger.max
      try await Task.sleep(nanoseconds: 5000000)
      print("\t max=", currentMaxVal)
    }
  }

  try! await [taskUpdate.value, taskSensor.value]
}

await mainOnlyUseTask()

