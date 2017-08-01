function hasFreeSlot(workers) {
  for (var i = 0; i < workers.length; i++) {
    if(workers[i] == 0)
      return i;
  }
  return -1;
}

function nextCheck(workers) {
  return Math.min(...workers);
}

function refresh(workers, time) {
  if(time <=0) return;
  for (var i = 0; i < workers.length; i++) {
    if(workers[i] <= time)
      workers[i] = 0
  }
}

function queueTime(customers, n) {
  const workers = Array(n).fill(0);
  const length = customers.length;
  
  let time = 0;
  for(let i =0; i < length; i++) {
    const val = customers[i];
    refresh(workers, time)
    // console.log(val, workers, time);
    let freeIndex = hasFreeSlot(workers)
    if (freeIndex != -1) {
      workers[freeIndex] = time + val;
      // console.log("assign ", val, workers, time);
      continue;
    }
    
    time = nextCheck(workers);
    i--;
  }

  return Math.max(...workers);
}


queueTime([2,2,3,3,4,4], 2)