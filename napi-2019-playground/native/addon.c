#define NAPI_VERSION 3
#include <string.h>
#include <node_api.h>

static napi_status get_utf8_string(napi_env env, napi_value str, char **out_buff, size_t *buffsize) {

    size_t      len;
    size_t      len2;
    char       *buff;
    napi_status res;

    if (out_buff == NULL) {
        return napi_invalid_arg;
    }

    res = napi_get_value_string_utf8(env, str, NULL, 0, &len);
    if (res != napi_ok) {
        return res;
    }

    /* +1 since napi_get_value_string_utf8 doesn't include NULL terminator
     * c.f. https://nodejs.org/api/n-api.html#n_api_napi_get_value_string_utf8
     */
    buff = (char *) malloc(len + 1);
    if (!buff) {
        return napi_generic_failure;
    }

    res = napi_get_value_string_utf8(env, str, buff, len + 1, &len2);
    if (res != napi_ok) {
        free(buff);
        return napi_generic_failure;
    }

    *out_buff = buff;

    if (buffsize) {
        *buffsize = len;
    }
    return napi_ok;
}

napi_value get_string_length(napi_env env, napi_callback_info info) {

    napi_value      argv[1];
    size_t          argc       = 1;
    char           *str        = NULL;
    size_t          str_len    = 0;
    napi_status     res;

    res = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    if (res != napi_ok) {
        napi_throw_error(env, "EINVAL", "Call to napi_get_cb_info failed");
        return NULL;
    }
    if (argc < 1) {
        napi_throw_error(env, "EINVAL", "get_string_length expect 1 argument");
        return NULL;
    }

    res = get_utf8_string(env, argv[0], &str, &str_len);
    if (res != napi_ok) {
        goto err;
    }
    napi_value result;
    res = napi_create_uint32(env, str_len, &result);
    if (res != napi_ok) {
        goto err;
    }

    free(str);
    return result;

err:
    napi_throw_error(env, "EINVAL", "Something went wrong.");
    free(str);
    return NULL;
}
