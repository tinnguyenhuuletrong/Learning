#define NAPI_VERSION 3
#include <string.h>
#include <node_api.h>

extern napi_value get_string_length(napi_env env, napi_callback_info info);

napi_value init_all(napi_env env, napi_value exports) {
    napi_value  fn;
    napi_status res;

    res = napi_create_function(env, NULL, 0, get_string_length, NULL, &fn);
    if (res != napi_ok) {
        napi_throw_error(env, "EINVAL", "Cannot create function");
        return NULL;
    }
    res = napi_set_named_property(env, exports, "get_string_length", fn);
    if (res != napi_ok) {
        napi_throw_error(env, "EINVAL", "Cannot set named property");
        return NULL;
    }
    return exports;
}
NAPI_MODULE(libAddon, init_all)