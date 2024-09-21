#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int myRandom(int min, int max) {
    /* initialize random seed: */
    srand (time(NULL));
   
    return min + rand() % (max - min);
}