//
//  iOSPluginBridge.cpp
//  iOSPlugin
//
//  Created by Bao Tran on 1/5/16.
//  Copyright © 2016 Bao Tran. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MTPopupWindow.h"
#include "iOSPluginBridge.hpp"

extern "C" UIViewController* UnityGetGLViewController();

MTPopupWindow* _MTPopupWindow;

void ShowWebViewPopup(const char* url)
{
    _MTPopupWindow = [[MTPopupWindow alloc] init];
    
    [_MTPopupWindow ShowWebViewPopup:CreateNSString(url) insideView:UnityGetGLViewController().view];    
}

void RegisterEvent(const char* eventName, const char* objName, const char* methodName)
{
    [_MTPopupWindow RegisterEvent:CreateNSString(eventName) : CreateNSString(objName) : CreateNSString(methodName)];
}

void SendEvent(const char* eventName, const char* jsonArg)
{
    [_MTPopupWindow SendEvent:CreateNSString(eventName) : CreateNSString(jsonArg)];
}

void ClearAllEvent()
{
    [_MTPopupWindow ClearAllEvent];
}

NSString* CreateNSString (const char* string)
{
    if (string)
        return [NSString stringWithUTF8String: string];
    else
        return [NSString stringWithUTF8String: ""];
}