
#import <Foundation/Foundation.h>

#import <Cordova/CDVPlugin.h>
#import <Cordova/CDVJSON.h>

#import "AppDelegate.h"


@interface Cache : CDVPlugin
{
}

-(void) clear: (CDVInvokedUrlCommand*)command;

// retain command for async repsonses
@property (nonatomic, strong) CDVInvokedUrlCommand* command;

@end
