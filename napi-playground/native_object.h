#ifndef NATIVEOBJECT_H
#define NATIVEOBJECT_H

#include <napi.h>

class NativeObject : public Napi::ObjectWrap<NativeObject>
{
  public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    NativeObject(const Napi::CallbackInfo &info);

    Napi::Value GetValue(const Napi::CallbackInfo &info);

  private:
    static Napi::FunctionReference constructor;

    Napi::Value PlusOne(const Napi::CallbackInfo &info);
    Napi::Value Multiply(const Napi::CallbackInfo &info);

    double value_;
};

#endif