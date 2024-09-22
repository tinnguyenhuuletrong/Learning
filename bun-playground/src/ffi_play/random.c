#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <node/node_api.h>

int myRandom(int min, int max) {
    /* initialize random seed: */
    srand (time(NULL));
   
    return min + rand() % (max - min);
}

napi_value hello_napi(napi_env env) {
  napi_value result;
  napi_create_string_utf8(env, "Hello, Napi!", NAPI_AUTO_LENGTH, &result);
  return result;
}