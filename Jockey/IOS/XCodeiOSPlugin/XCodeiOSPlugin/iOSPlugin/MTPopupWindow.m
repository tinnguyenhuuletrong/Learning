//
//  MTPopupWindow.m
//  PopupWindowProject
//
//  Created by Marin Todorov on 7/1/11.
//  Copyright 2011 Marin Todorov. MIT license
//  http://www.opensource.org/licenses/mit-license.php
//

#import "Jockey.h"
#import "MTPopupWindow.h"
#import <UIKit/UIKit.h>
#import <UIKit/UIScreen.h>

#define kShadeViewTag 1000

@interface MTPopupWindow(Private)
- (id)initWithSuperview:(UIView*)sview andFile:(NSString*)fName;
@end

@implementation MTPopupWindow


-(void)ShowWebViewPopup:(NSString*)fileName insideView:(UIView*)view
{
    [[MTPopupWindow alloc] initWithSuperview:view andFile:fileName];
    NSLog(@"ShowWebViewPopup");
}

-(void)RegisterEvent:(NSString *)eventName :(NSString *)objName :(NSString *)methodName
{
    [Jockey on:eventName perform:^(NSDictionary *payload)
    {
        NSLog(@"payload = %@", payload);
    }];
}

-(void)SendEvent:(NSString *)eventName :(NSString *)jsonArg
{
//    [Jockey send:eventName withPayload:jsonArg toWebView:web];
}

-(void)ClearAllEvent
{
    NSLog(@"ClearAllEvent");
}

-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    return [Jockey webView:web withUrl:[request URL]];
}

- (id)initWithSuperview:(UIView*)sview andFile:(NSString*)fName
{
    self = [super init];
    if (self) {
        // Initialization code here.
        bgView = [[[UIView alloc] initWithFrame: sview.bounds] autorelease];
        [sview addSubview: bgView];
        // proceed with animation after the bgView was added
        [self performSelector:@selector(doTransitionWithContentFile:) withObject:fName afterDelay:0.1];
    }
    
    return self;
}


-(void)doTransitionWithContentFile:(NSString*)fName
{
    //faux view
    UIView* fauxView = [[[UIView alloc] initWithFrame: [UIScreen mainScreen].bounds] autorelease];
    [bgView addSubview: fauxView];

    //the new panel
    bigPanelView = [[[UIView alloc] initWithFrame:CGRectMake(0, 0, bgView.frame.size.width, bgView.frame.size.height)] autorelease];
    bigPanelView.center = CGPointMake( bgView.frame.size.width/2, bgView.frame.size.height/2);
    
    //add the window background
    float bgOffset = 10;
    UIImageView* background = [[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"popupWindowBack.png"]] autorelease];
    background.bounds = CGRectInset(bgView.frame, bgOffset, bgOffset);
    background.center = CGPointMake(bigPanelView.frame.size.width/2, bigPanelView.frame.size.height/2);
    [bigPanelView addSubview: background];
    
    //add the web view
    int webOffset = 30;
    web = [[[UIWebView alloc] initWithFrame:CGRectInset(background.frame, webOffset, webOffset)] autorelease];
    web.backgroundColor = [UIColor clearColor];
    
    if ([fName hasPrefix:@"http"]) {
        //load a web page
        web.scalesPageToFit = YES;
        [web loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString: fName]]];
    } else {
        //load a local file
        NSError* error = nil;
        NSString* fileContents = [NSString stringWithContentsOfFile:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:fName] encoding:NSUTF8StringEncoding error: &error];
        if (error!=NULL) {
            NSLog(@"error loading %@: %@", fName, [error localizedDescription]);
        } else {
            [web loadHTMLString: fileContents baseURL:[NSURL URLWithString:@"file://"]];
        }
    }
    
    [bigPanelView addSubview: web];
    
    //add the close button
    
    int closeBtnOffset = 10;
    
//    closeBtnImg = [UIImage imageNamed:@"popupCloseBtn.png"];
//    UIButton* closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
//    [closeBtn setImage:closeBtnImg forState:UIControlStateNormal];
//    [closeBtn setFrame:CGRectMake( background.frame.origin.x + background.frame.size.width - closeBtnImg.size.width - closeBtnOffset,
//                                   background.frame.origin.y ,
//                                   closeBtnImg.size.width + closeBtnOffset,
//                                  closeBtnImg.size.height + closeBtnOffset)];
//    [closeBtn addTarget:self action:@selector(closePopupWindow) forControlEvents:UIControlEventTouchUpInside];
//    [bigPanelView addSubview: closeBtn];

    UIButton* closeBtn =  [UIButton buttonWithType:UIButtonTypeCustom];
    [closeBtn setFrame:CGRectMake( background.frame.origin.x + background.frame.size.width - 50 - closeBtnOffset,
                                  background.frame.origin.y ,
                                  50 + closeBtnOffset,
                                  50 + closeBtnOffset)];
    [closeBtn addTarget:self action:@selector(closePopupWindow) forControlEvents:UIControlEventTouchUpInside];
    
    UILabel* labelBtn = [[UILabel alloc]initWithFrame:CGRectMake(5, 5, 50, 20)];
    [labelBtn setFont:[UIFont fontWithName:@"Arial-BoldMT" size:15]];
    [labelBtn setText:@"X"];
    [labelBtn setTextAlignment: NSTextAlignmentCenter];
    [labelBtn setTextColor:[UIColor blueColor]];
    [labelBtn setBackgroundColor:[UIColor clearColor]];
    [closeBtn addSubview:labelBtn];
    
    [bigPanelView addSubview: closeBtn];
    
    
    //animation options
    UIViewAnimationOptions options = UIViewAnimationOptionTransitionFlipFromBottom |
                                        UIViewAnimationOptionAllowUserInteraction    |
                                        UIViewAnimationOptionBeginFromCurrentState;
    
    //run the animation
    [UIView transitionFromView:fauxView toView:bigPanelView duration:0.5 options:options completion: ^(BOOL finished) {
        
        //dim the contents behind the popup window
        UIView* shadeView = [[[UIView alloc] initWithFrame:bigPanelView.frame] autorelease];
        shadeView.backgroundColor = [UIColor blackColor];
        shadeView.alpha = 0.3;
        shadeView.tag = kShadeViewTag;
        [bigPanelView addSubview: shadeView];
        [bigPanelView sendSubviewToBack: shadeView];
    }];
}

-(void)closePopupWindow
{
    //remove the shade
    [[bigPanelView viewWithTag: kShadeViewTag] removeFromSuperview];    
    [self performSelector:@selector(closePopupWindowAnimate) withObject:nil afterDelay:0.1];
}

-(void)closePopupWindowAnimate
{
    //faux view
    __block UIView* fauxView = [[UIView alloc] initWithFrame: CGRectMake(10, 10, 200, 200)];
    [bgView addSubview: fauxView];

    //run the animation
    UIViewAnimationOptions options = UIViewAnimationOptionTransitionFlipFromTop |
    UIViewAnimationOptionAllowUserInteraction    |
    UIViewAnimationOptionBeginFromCurrentState;
    
    //hold to the bigPanelView, because it'll be removed during the animation
    [bigPanelView retain];
    
    [UIView transitionFromView:bigPanelView toView:fauxView duration:0.5 options:options completion:^(BOOL finished) {

        //when popup is closed, remove all the views
        for (UIView* child in bigPanelView.subviews) {
            [child removeFromSuperview];
        }
        for (UIView* child in bgView.subviews) {
            [child removeFromSuperview];
        }
        [bigPanelView release];
        [bgView removeFromSuperview];
        
        [self release];
    }];
}
@end