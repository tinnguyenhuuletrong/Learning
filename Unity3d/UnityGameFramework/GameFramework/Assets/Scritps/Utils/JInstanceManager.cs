using System;
using System.Collections.Generic;

namespace JUnityGameFramework {
public static class JInstanceManager {

    private static Dictionary<Type, object> mInstanceManager = new Dictionary<Type, object>();
    

    public static void Register(Type name, object instance) {
        mInstanceManager[name] = instance;
    }

    public static object Get(Type type) {
        return mInstanceManager[type];
    }
}
}