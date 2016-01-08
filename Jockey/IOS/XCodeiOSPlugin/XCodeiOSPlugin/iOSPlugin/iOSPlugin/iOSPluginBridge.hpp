//
//  iOSPluginBridge.hpp
//  iOSPlugin
//
//  Created by Bao Tran on 1/5/16.
//  Copyright © 2016 Bao Tran. All rights reserved.
//

extern "C"
{
    void ShowWebViewPopup(const char* url);
    void RegisterEvent(const char* eventName, const char* objName, const char* methodName);
    void SendEvent(const char* eventName, const char* jsonArg);
    void ClearAllEvent();
    
    NSString* CreateNSString (const char* string);
}