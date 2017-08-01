function simulate(workers, time) { 
  let timeToImpart = Number.MAX_SAFE_INTEGER;
  const length = workers.length;
  let index = 0;
  for(let i =0; i< length; i++) {
    let val = workers[i];
    if(val > 0 && time > val) { 
      workers[i] = -1;
      val = -1;
    }

    if(val == -1)
      index = i;
    
    if(val > 0 && val < timeToImpart) {
      timeToImpart = val;
    }
  }
  return {sleep: timeToImpart, freeSlot: index};
}

function queueTime(customers, n) {
  const workers = Array(n).fill(-1);
  const length = customers.length;
  
  let status = simulate(workers, 0);
  let time = 0;
  for(let i =0; i < length; i++) {
    const val = customers[i];
    console.log(workers, status, time);
    workers[status.freeSlot] = time + val;
    status = simulate(workers, time);
    time = status.sleep
  }
  status = simulate(workers, time);
  return status.sleep;
}