!function(t,e){var i=t.createElement("style");if(t.getElementsByTagName("head")[0].appendChild(i),i.styleSheet)i.styleSheet.disabled||(i.styleSheet.cssText=e);else try{i.innerHTML=e}catch(n){i.innerText=e}}(document,"/* Empty. Add your own CSS if you like */\n\n.timePickerColon {\n  padding-top: 40px;\n  text-align: center;\n  font-weight: bold;\n}\n\n.timePickerArrows {\n  width: 100%;\n}\n\n.timePickerBoxText {\n  height: 40px;\n  text-align: center;\n  border: 1px solid #dddddd;\n  font-size: 16px;\n  padding-top: 5px;\n}\n\n.overflowShow {\n  white-space: normal !important;\n}"),function(t){try{t=angular.module("ionic-timepicker.templates")}catch(e){t=angular.module("ionic-timepicker.templates",[])}t.run(["$templateCache",function(t){t.put("ionic-timepicker-12-hour.html",'<div class=twelveHourTimePickerChildDiv><div class=row><span class="button-small col col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseHours()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.hours class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseHours()><i class="icon ion-chevron-down"></i></button></span> <label class="col col-10 timePickerColon">:</label> <span class="button-small col col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseMinutes()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.minutes class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseMinutes()><i class="icon ion-chevron-down"></i></button></span> <label class="col col-10 timePickerColon">:</label> <span class="button-small col col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=changeMeridian()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.meridian class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=changeMeridian()><i class="icon ion-chevron-down"></i></button></span></div></div>')}])}(),function(t){try{t=angular.module("ionic-timepicker.templates")}catch(e){t=angular.module("ionic-timepicker.templates",[])}t.run(["$templateCache",function(t){t.put("ionic-timepicker-24-hour.html",'<div class=24HourTimePickerChildDiv><div class=row><span class="button-small col col-offset-20 col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseHours()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.hours class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseHours()><i class="icon ion-chevron-down"></i></button></span> <label class="col col-10 timePickerColon">:</label> <span class="button-small col col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseMinutes()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.minutes class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseMinutes()><i class="icon ion-chevron-down"></i></button></span></div></div>')}])}(),function(){"use strict";angular.module("ionic-timepicker",["ionic","ionic-timepicker.templates"])}(),function(){"use strict";function t(t){return{restrict:"AE",replace:!0,scope:{inputObj:"=inputObj"},link:function(e,i,n){var o=(new Date,60*(new Date).getHours()*60+60*(new Date).getMinutes());e.inputEpochTime=e.inputObj.inputEpochTime?e.inputObj.inputEpochTime:o,e.step=e.inputObj.step?e.inputObj.step:15,e.format=e.inputObj.format?e.inputObj.format:24,e.titleLabel=e.inputObj.titleLabel?e.inputObj.titleLabel:"Time Picker",e.setLabel=e.inputObj.setLabel?e.inputObj.setLabel:"Set",e.closeLabel=e.inputObj.closeLabel?e.inputObj.closeLabel:"Close",e.setButtonType=e.inputObj.setButtonType?e.inputObj.setButtonType:"button-positive",e.closeButtonType=e.inputObj.closeButtonType?e.inputObj.closeButtonType:"button-stable";var s={epochTime:e.inputEpochTime,step:e.step,format:e.format};e.time={hours:0,minutes:0,meridian:""};var u=new Date(1e3*s.epochTime);e.increaseHours=function(){e.time.hours=Number(e.time.hours),12==s.format&&(12!=e.time.hours?e.time.hours+=1:e.time.hours=1),24==s.format&&(e.time.hours=(e.time.hours+1)%24),e.time.hours=e.time.hours<10?"0"+e.time.hours:e.time.hours},e.decreaseHours=function(){e.time.hours=Number(e.time.hours),12==s.format&&(e.time.hours>1?e.time.hours-=1:e.time.hours=12),24==s.format&&(e.time.hours=(e.time.hours+23)%24),e.time.hours=e.time.hours<10?"0"+e.time.hours:e.time.hours},e.increaseMinutes=function(){e.time.minutes=Number(e.time.minutes),e.time.minutes=(e.time.minutes+s.step)%60,e.time.minutes=e.time.minutes<10?"0"+e.time.minutes:e.time.minutes},e.decreaseMinutes=function(){e.time.minutes=Number(e.time.minutes),e.time.minutes=(e.time.minutes+(60-s.step))%60,e.time.minutes=e.time.minutes<10?"0"+e.time.minutes:e.time.minutes},e.changeMeridian=function(){e.time.meridian="AM"===e.time.meridian?"PM":"AM"},i.on("click",function(){u="undefined"==typeof e.inputObj.inputEpochTime||null===e.inputObj.inputEpochTime?new Date:new Date(1e3*e.inputObj.inputEpochTime),12==s.format?(e.time.meridian=u.getUTCHours()>=12?"PM":"AM",e.time.hours=u.getUTCHours()>12?u.getUTCHours()-12:(u.getUTCHours()==0?12:u.getUTCHours()),e.time.minutes=u.getUTCMinutes(),e.time.hours=e.time.hours<10?"0"+e.time.hours:e.time.hours,e.time.minutes=e.time.minutes<10?"0"+e.time.minutes:e.time.minutes,0===e.time.hours&&"AM"===e.time.meridian&&(e.time.hours=12),t.show({templateUrl:"ionic-timepicker-12-hour.html",title:e.titleLabel,subTitle:"",scope:e,buttons:[{text:e.closeLabel,type:e.closeButtonType,onTap:function(t){e.inputObj.callback(void 0)}},{text:e.setLabel,type:e.setButtonType,onTap:function(t){e.loadingContent=!0;var i=0;i=12!=e.time.hours?60*e.time.hours*60+60*e.time.minutes:60*e.time.minutes,"AM"===e.time.meridian?i+=0:"PM"===e.time.meridian&&(i+=43200),e.etime=i,e.inputObj.callback(e.etime)}}]})):24==s.format&&(e.time.hours=u.getUTCHours(),e.time.minutes=u.getUTCMinutes(),e.time.hours=e.time.hours<10?"0"+e.time.hours:e.time.hours,e.time.minutes=e.time.minutes<10?"0"+e.time.minutes:e.time.minutes,t.show({templateUrl:"ionic-timepicker-24-hour.html",title:e.titleLabel,subTitle:"",scope:e,buttons:[{text:e.closeLabel,type:e.closeButtonType,onTap:function(t){e.inputObj.callback(void 0)}},{text:e.setLabel,type:e.setButtonType,onTap:function(t){e.loadingContent=!0;var i=0;i=24!=e.time.hours?60*e.time.hours*60+60*e.time.minutes:60*e.time.minutes,e.etime=i,e.inputObj.callback(e.etime)}}]}))})}}}angular.module("ionic-timepicker").directive("ionicTimepicker",t),t.$inject=["$ionicPopup"]}();

/*
	(function () {
	  'use strict';

	  angular.module('ionic-timepicker', ['ionic','ionic-timepicker.templates'])

	})();

	(function () {
	  'use strict';

	  angular.module('ionic-timepicker')
	    .directive('ionicTimepicker', ionicTimepicker);

	  ionicTimepicker.$inject = ['$ionicPopup'];
	  function ionicTimepicker($ionicPopup) {
	    return {
	      restrict: 'AE',
	      replace: true,
	      scope: {
	        inputObj: "=inputObj"
	      },
	      link: function (scope, element, attrs) {

	        var today = new Date();
	        var currentEpoch = ((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60);

	        //set up base variables and options for customization
	        scope.inputEpochTime = scope.inputObj.inputEpochTime ? scope.inputObj.inputEpochTime : currentEpoch;
	        scope.step = scope.inputObj.step ? scope.inputObj.step : 15;
	        scope.format = scope.inputObj.format ? scope.inputObj.format : 24;
	        scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Time Picker';
	        scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
	        scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
	        scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
	        scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';

	        var obj = {epochTime: scope.inputEpochTime, step: scope.step, format: scope.format};
	        scope.time = {hours: 0, minutes: 0, meridian: ""};
	        var objDate = new Date(obj.epochTime * 1000);       // Epoch time in milliseconds.

	        //Increasing the hours
	        scope.increaseHours = function () {
	          scope.time.hours = Number(scope.time.hours);
	          if (obj.format == 12) {
	            if (scope.time.hours != 12) {
	              scope.time.hours += 1;
	            } else {
	              scope.time.hours = 1;
	            }
	          }
	          if (obj.format == 24) {
	            scope.time.hours = (scope.time.hours + 1) % 24;
	          }
	          scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
	        };

	        //Decreasing the hours
	        scope.decreaseHours = function () {
	          scope.time.hours = Number(scope.time.hours);
	          if (obj.format == 12) {
	            if (scope.time.hours > 1) {
	              scope.time.hours -= 1;
	            } else {
	              scope.time.hours = 12;
	            }
	          }
	          if (obj.format == 24) {
	            scope.time.hours = (scope.time.hours + 23) % 24;
	          }
	          scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
	        };

	        //Increasing the minutes
	        scope.increaseMinutes = function () {
	          scope.time.minutes = Number(scope.time.minutes);
	          scope.time.minutes = (scope.time.minutes + obj.step) % 60;
	          scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
	        };

	        //Decreasing the minutes
	        scope.decreaseMinutes = function () {
	          scope.time.minutes = Number(scope.time.minutes);
	          scope.time.minutes = (scope.time.minutes + (60 - obj.step)) % 60;
	          scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
	        };

	        //Changing the meridian
	        scope.changeMeridian = function () {
	          scope.time.meridian = (scope.time.meridian === "AM") ? "PM" : "AM";
	        };

	        //onclick of the button
	        element.on("click", function () {
	          if (typeof scope.inputObj.inputEpochTime === 'undefined' || scope.inputObj.inputEpochTime === null) {
	            objDate = new Date();
	          } else {
	            objDate = new Date(scope.inputObj.inputEpochTime * 1000);
	          }

	          if (obj.format == 12) {
	            scope.time.meridian = (objDate.getUTCHours() >= 12) ? "PM" : "AM";
	            scope.time.hours = (objDate.getUTCHours() > 12) ? ((objDate.getUTCHours() - 12)) : (objDate.getUTCHours() == 0?12:objDate.getUTCHours());
	            scope.time.minutes = (objDate.getUTCMinutes());

	            scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
	            scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

	            if (scope.time.hours === 0 && scope.time.meridian === "AM") {
	              scope.time.hours = 12;
	            }

	            $ionicPopup.show({
	              templateUrl: 'ionic-timepicker-12-hour.html',
	              title: scope.titleLabel,
	              subTitle: '',
	              scope: scope,
	              buttons: [
	                {
	                  text: scope.closeLabel,
	                  type: scope.closeButtonType,
	                  onTap: function (e) {
	                    scope.inputObj.callback(undefined);
	                  }
	                },
	                {
	                  text: scope.setLabel,
	                  type: scope.setButtonType,
	                  onTap: function (e) {
	                    scope.loadingContent = true;

	                    var totalSec = 0;

	                    if (scope.time.hours != 12) {
	                      totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
	                    } else {
	                      totalSec = scope.time.minutes * 60;
	                    }

	                    if (scope.time.meridian === "AM") {
	                      totalSec += 0;
	                    } else if (scope.time.meridian === "PM") {
	                      totalSec += 43200;
	                    }
	                    scope.etime = totalSec;
	                    scope.inputObj.callback(scope.etime);
	                  }
	                }
	              ]
	            });

	          } else if (obj.format == 24) {

	            scope.time.hours = (objDate.getUTCHours());
	            scope.time.minutes = (objDate.getUTCMinutes());

	            scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
	            scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

	            $ionicPopup.show({
	              templateUrl: 'ionic-timepicker-24-hour.html',
	              title: scope.titleLabel,
	              subTitle: '',
	              scope: scope,
	              buttons: [
	                {
	                  text: scope.closeLabel,
	                  type: scope.closeButtonType,
	                  onTap: function (e) {
	                    scope.inputObj.callback(undefined);
	                  }
	                },
	                {
	                  text: scope.setLabel,
	                  type: scope.setButtonType,
	                  onTap: function (e) {

	                    scope.loadingContent = true;

	                    var totalSec = 0;

	                    if (scope.time.hours != 24) {
	                      totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
	                    } else {
	                      totalSec = scope.time.minutes * 60;
	                    }
	                    scope.etime = totalSec;
	                    scope.inputObj.callback(scope.etime);
	                  }
	                }
	              ]
	            });
	          }
	        });
	      }
	    };
	  }

	})();
*/