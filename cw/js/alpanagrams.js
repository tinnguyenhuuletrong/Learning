function swap(A, i, j) {
  let tmp = A[i];
  A[i] = A[j];
  A[j] = tmp
}

// Knuths
// Step1: find latest A[i] >= A[i+1]
// Step2: find A[j] > A[i] AND A[i] is min from [i+1 , n]
// Step3: Swap A[i], A[j]
// Step4: Reverse range [i+1, n]
function next(A) {
  const length = A.length
  let i = length - 2
  let j;
  while(A[i] >= A[i+1] && i>=0) {
    i--;
  }

  if(i<0 ) return false;
  
  let minIndex =i+1
  for(j = length -1; j >= i; j--)  {
    if(A[j] > A[i]) { 
      minIndex = j;
      break;
    }
  }
  
  swap(A,i,minIndex);
  
  for(i = i+1, j = length - 1; i < j ;i++,j--) {
    swap(A,i,j)
  }
  return true
}


function listPosition(word) {
  //Return the anagram list position of the word
  let arr = Array.from(word).sort()
 
  let count = 1;
  do {
    console.log(arr.join(''), count)
  	 // if(arr.join('') == word)
  	 	// return count
  	count++
  } while(next(arr))

  return 1;
}
//---------------------------------------------------------------//

console.log(listPosition('BOOKKEEPER'))

// P = (total number of letters)! / (number of repeats)!

// Diference
// Des 
// Set(Des) -> S
// while(n>0)
//    find index Des[i] in set S
//    T = S.length! / (numDuplicate)!
//    A += i * T / n
//    remove Des[i] in S
//    n--
