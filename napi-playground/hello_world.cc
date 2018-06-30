#include <string>
#include <sstream>
#include <napi.h>
#include "native_object.h"
#include "lib_pi_wrapper.h"

Napi::String SayHi(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    return Napi::String::New(env, "Hi!");
}

void RunCallback(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::Function cb = info[0].As<Napi::Function>();
    cb.MakeCallback(env.Global(), {Napi::String::New(env, "hello world")});
}

Napi::Value Add(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 2)
    {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsNumber() || !info[1].IsNumber())
    {
        Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    double arg0 = info[0].As<Napi::Number>().DoubleValue();
    double arg1 = info[1].As<Napi::Number>().DoubleValue();
    Napi::Number num = Napi::Number::New(env, arg0 + arg1);

    return num;
}

Napi::Object CreateObject(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::Object obj = Napi::Object::New(env);
    obj.Set(Napi::String::New(env, "msg"), info[0].ToString());

    return obj;
}

Napi::String FunctionObjectFromNative(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    return Napi::String::New(env, "from native - hello world");
}
Napi::Function CreateFunction(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::Function fn = Napi::Function::New(env, FunctionObjectFromNative, "wasBornFromNative");
    return fn;
}

Napi::Value Inspect(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    NativeObject *obj = Napi::ObjectWrap<NativeObject>::Unwrap(info[0].As<Napi::Object>());

    if (obj == 0) {
        Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    // Get address of ptr as string
    const void *address = static_cast<const void *>(obj);
    std::stringstream ss;
    ss << address;
    std::string name = ss.str();

    Napi::Object result = Napi::Object::New(env);
    result.Set(Napi::String::New(env, "value"), obj->GetValue(info));
    result.Set(Napi::String::New(env, "_ptr"), Napi::String::New(env, ss.str().c_str()));

    return result;
}

Napi::Object init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "sayHi"), Napi::Function::New(env, SayHi));
    exports.Set(Napi::String::New(env, "callMe"), Napi::Function::New(env, RunCallback));
    exports.Set(Napi::String::New(env, "nadd"), Napi::Function::New(env, Add));
    exports.Set(Napi::String::New(env, "nobject"), Napi::Function::New(env, CreateObject));
    exports.Set(Napi::String::New(env, "nfunc"), Napi::Function::New(env, CreateFunction));

    // Object init
    NativeObject::Init(env, exports);
    exports.Set(Napi::String::New(env, "nObjectInspect"), Napi::Function::New(env, Inspect));

    // Libs
    exports.Set(Napi::String::New(env, "libPiSync"), Napi::Function::New(env, CalculateSync));
    exports.Set(Napi::String::New(env, "libPiAsync"), Napi::Function::New(env, CalculateAsync));

    return exports;
};

NODE_API_MODULE(hello_world, init);