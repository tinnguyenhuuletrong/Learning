#include <node.h>
// include the header file generated from the Go build
#include "lib/libgo.h"

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void HelloMethod(const FunctionCallbackInfo<Value> &args)
{
  Isolate *isolate = args.GetIsolate();
  // Call exported Go function, which returns a C string
  char *c = Hello();
  // return the value
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, c));
  delete c;
}

// add method to exports
void Init(Local<Object> exports)
{
  NODE_SET_METHOD(exports, "hello", HelloMethod);
}

// create module
NODE_MODULE(myGoAddon, Init)