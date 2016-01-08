//
//  MTPopupWindow.h
//  PopupWindowProject
//
//  Created by Marin Todorov on 7/1/11.
//  Copyright 2011 Marin Todorov. MIT license
//  http://www.opensource.org/licenses/mit-license.php
//  

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface MTPopupWindow : NSObject
{
    UIView* bgView;
    UIView* bigPanelView;
    UIWebView* web;
}

-(void)ShowWebViewPopup:(NSString*)fileName insideView:(UIView*)view;
-(void)RegisterEvent:(NSString*) eventName : (NSString*) objName : (NSString*) methodName;
-(void)SendEvent:(NSString*) eventName : (NSString*) jsonArg;
-(void)ClearAllEvent;

@end
