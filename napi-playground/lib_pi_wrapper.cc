#include <napi.h>
#include "libpi/pi.h"  // NOLINT(build/include)
#include "lib_pi_wrapper.h"  // NOLINT(build/include)

// Simple synchronous access to the `Estimate()` function
 Napi::Value CalculateSync(const Napi::CallbackInfo& info) {
  // expect a number as the first argument
  int points = info[0].As<Napi::Number>().Uint32Value();
  double est = Estimate(points);

  return Napi::Number::New(info.Env(), est);
}

//------------------------------------------------------------------------------------
// Async worker
//------------------------------------------------------------------------------------
class PiWorker : public Napi::AsyncWorker {
 public:
  PiWorker(Napi::Function& callback, int points)
    : Napi::AsyncWorker(callback), points(points), estimate(0) {}
  ~PiWorker() {}

  // Executed inside the worker-thread.
  // It is not safe to access JS engine data structure
  // here, so everything we need for input and output
  // should go on `this`.
  void Execute () {
    this->estimate = Estimate(this->points);
  }

  // Executed when the async work is complete
  // this function will be run inside the main event loop
  // so it is safe to use JS engine data again
  void OnOK() {
    Napi::Env env = this->Env();
    Napi::HandleScope scope(env);
    Callback().Call({env.Undefined(), Napi::Number::New(env, this->estimate)});
  }

 private:
  int points;
  double estimate;
};

// Asynchronous access to the `Estimate()` function
Napi::Value CalculateAsync(const Napi::CallbackInfo& info) {
  int points = info[0].As<Napi::Number>().Uint32Value();
  Napi::Function callback = info[1].As<Napi::Function>();

  // Auto-delete when OnWorkComplete called
  PiWorker* piWorker = new PiWorker(callback, points);
  piWorker->Queue();

  return info.Env().Undefined();
}