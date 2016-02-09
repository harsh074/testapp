/*angular.module("ionic-timepicker",["ionic","ionic-timepicker.templates"]).directive("ionicTimepicker",["$ionicPopup","$filter",function(e,t){return{restrict:"AE",replace:!0,scope:{time:"=",step:"@",format:"@",popupTitle:"@",btnCloseText:"@",btnSetText:"@",btnCloseType:"@",btnSetType:"@"},link:function(i,n){n.on("click",function(){function n(){i.slot={hours:t("date")(i.timePicker.time,12==i.timePicker.format?"hh":"HH"),minutes:t("date")(i.timePicker.time,"mm"),meridian:t("date")(i.timePicker.time,"a")}}i.timePicker={time:new Date(i.time.getTime()),step:angular.isDefined(i.step)&&i.step>0&&i.step<60?Number(i.step):10,format:angular.isDefined(i.format)&&24==i.format?24:12,popupTitle:"",btnCloseText:angular.isDefined(i.btnCloseText)?i.btnCloseText:"Close",btnSetText:angular.isDefined(i.btnSetText)?i.btnSetText:"Set",btnCloseType:angular.isDefined(i.btnCloseType)?i.btnCloseType:"button-default",btnSetType:angular.isDefined(i.btnSetType)?i.btnSetType:"button-positive"},i.timePicker.popupTitle=angular.isDefined(i.popupTitle)?i.popupTitle:12==i.timePicker.format?"12-Hour Format":"24-Hour Format",n(),i.increaseHours=function(){i.timePicker.time.setHours(i.timePicker.time.getHours()+1),n()},i.decreaseHours=function(){i.timePicker.time.setHours(i.timePicker.time.getHours()-1),n()},i.increaseMinutes=function(){var e=i.timePicker.time.getMinutes();e%i.timePicker.step!=0&&(e-=e%i.timePicker.step),i.timePicker.time.setMinutes(e+i.timePicker.step),n()},i.decreaseMinutes=function(){var e=i.timePicker.time.getMinutes();e-=e%i.timePicker.step!=0?e%i.timePicker.step:i.timePicker.step,i.timePicker.time.setMinutes(e),n()},12==i.timePicker.format&&(i.changeMeridian=function(){i.timePicker.time.setHours(i.timePicker.time.getHours()+12),n()}),e.show({templateUrl:"time-picker.html",title:"<strong>"+i.timePicker.popupTitle+"</strong>",subTitle:"",scope:i,buttons:[{text:i.timePicker.btnCloseText,type:i.timePicker.btnCloseType},{text:i.timePicker.btnSetText,type:i.timePicker.btnSetType,onTap:function(){i.time.setHours(i.timePicker.time.getHours()),i.time.setMinutes(i.timePicker.time.getMinutes())}}]})})}}}]);


!function(t){try{t=angular.module("ionic-timepicker.templates")}catch(o){t=angular.module("ionic-timepicker.templates",[])}t.run(["$templateCache",function(t){t.put("time-picker.html",'<div class=timePickerChildDiv><div class=row><span class="button-small col-25" ng-class="timePicker.format == 24 ? \'col-offset-20\':\'\'"><button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseHours()><i class="icon ion-chevron-up"></i></button> <input type=text ng-model=slot.hours class="ipBoxes timePickerBoxText" disabled> <button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseHours()><i class="icon ion-chevron-down"></i></button></span> <label class="col-10 timePickerColon">:</label> <span class="button-small col-25"><button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseMinutes()><i class="icon ion-chevron-up"></i></button> <input type=text ng-model=slot.minutes class="ipBoxes timePickerBoxText" disabled> <button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseMinutes()><i class="icon ion-chevron-down"></i></button></span> <label class="col-10 timePickerColon" ng-show="timePicker.format == 12">:</label> <span class="button-small col-25" ng-show="timePicker.format == 12"><button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=changeMeridian()><i class="icon ion-chevron-up"></i></button> <input type=text ng-model=slot.meridian class="ipBoxes timePickerBoxText" disabled> <button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=changeMeridian()><i class="icon ion-chevron-down"></i></button></span></div></div>')}])}();*/


!function(t,e){var i=t.createElement("style");if(t.getElementsByTagName("head")[0].appendChild(i),i.styleSheet)i.styleSheet.disabled||(i.styleSheet.cssText=e);else try{i.innerHTML=e}catch(n){i.innerText=e}}(document,"/* Empty. Add your own CSS if you like */\n\n.timePickerColon {\n  padding-top: 40px;\n  text-align: center;\n  font-weight: bold;\n}\n\n.timePickerArrows {\n  width: 100%;\n}\n\n.timePickerBoxText {\n  height: 40px;\n  text-align: center;\n  border: 1px solid #dddddd;\n  font-size: 16px;\n  padding-top: 5px;\n}\n\n.overflowShow {\n  white-space: normal !important;\n}"),function(t){try{t=angular.module("ionic-timepicker.templates")}catch(e){t=angular.module("ionic-timepicker.templates",[])}t.run(["$templateCache",function(t){t.put("ionic-timepicker-12-hour.html",'<div class=twelveHourTimePickerChildDiv><div class=row><span class="button-small col col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseHours()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.hours class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseHours()><i class="icon ion-chevron-down"></i></button></span> <label class="col col-10 timePickerColon">:</label> <span class="button-small col col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseMinutes()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.minutes class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseMinutes()><i class="icon ion-chevron-down"></i></button></span> <label class="col col-10 timePickerColon">:</label> <span class="button-small col col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=changeMeridian()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.meridian class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=changeMeridian()><i class="icon ion-chevron-down"></i></button></span></div></div>')}])}(),function(t){try{t=angular.module("ionic-timepicker.templates")}catch(e){t=angular.module("ionic-timepicker.templates",[])}t.run(["$templateCache",function(t){t.put("ionic-timepicker-24-hour.html",'<div class=24HourTimePickerChildDiv><div class=row><span class="button-small col col-offset-20 col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseHours()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.hours class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseHours()><i class="icon ion-chevron-down"></i></button></span> <label class="col col-10 timePickerColon">:</label> <span class="button-small col col-25"><button type=button class="button button-clear button-small button-dark timePickerArrows marginBottom10" ng-click=increaseMinutes()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.minutes class="ipBoxes timePickerBoxText"></div><button type=button class="button button-clear button-small button-dark timePickerArrows marginTop10" ng-click=decreaseMinutes()><i class="icon ion-chevron-down"></i></button></span></div></div>')}])}(),function(){"use strict";angular.module("ionic-timepicker",["ionic","ionic-timepicker.templates"])}(),function(){"use strict";function t(t){return{restrict:"AE",replace:!0,scope:{inputObj:"=inputObj"},link:function(e,i,n){var o=(new Date,60*(new Date).getHours()*60+60*(new Date).getMinutes());e.inputEpochTime=e.inputObj.inputEpochTime?e.inputObj.inputEpochTime:o,e.step=e.inputObj.step?e.inputObj.step:15,e.format=e.inputObj.format?e.inputObj.format:24,e.titleLabel=e.inputObj.titleLabel?e.inputObj.titleLabel:"Time Picker",e.setLabel=e.inputObj.setLabel?e.inputObj.setLabel:"Set",e.closeLabel=e.inputObj.closeLabel?e.inputObj.closeLabel:"Close",e.setButtonType=e.inputObj.setButtonType?e.inputObj.setButtonType:"button-positive",e.closeButtonType=e.inputObj.closeButtonType?e.inputObj.closeButtonType:"button-stable";var s={epochTime:e.inputEpochTime,step:e.step,format:e.format};e.time={hours:0,minutes:0,meridian:""};var u=new Date(1e3*s.epochTime);e.increaseHours=function(){e.time.hours=Number(e.time.hours),12==s.format&&(12!=e.time.hours?e.time.hours+=1:e.time.hours=1),24==s.format&&(e.time.hours=(e.time.hours+1)%24),e.time.hours=e.time.hours<10?"0"+e.time.hours:e.time.hours},e.decreaseHours=function(){e.time.hours=Number(e.time.hours),12==s.format&&(e.time.hours>1?e.time.hours-=1:e.time.hours=12),24==s.format&&(e.time.hours=(e.time.hours+23)%24),e.time.hours=e.time.hours<10?"0"+e.time.hours:e.time.hours},e.increaseMinutes=function(){e.time.minutes=Number(e.time.minutes),e.time.minutes=(e.time.minutes+s.step)%60,e.time.minutes=e.time.minutes<10?"0"+e.time.minutes:e.time.minutes},e.decreaseMinutes=function(){e.time.minutes=Number(e.time.minutes),e.time.minutes=(e.time.minutes+(60-s.step))%60,e.time.minutes=e.time.minutes<10?"0"+e.time.minutes:e.time.minutes},e.changeMeridian=function(){e.time.meridian="AM"===e.time.meridian?"PM":"AM"},i.on("click",function(){u="undefined"==typeof e.inputObj.inputEpochTime||null===e.inputObj.inputEpochTime?new Date:new Date(1e3*e.inputObj.inputEpochTime),12==s.format?(e.time.meridian=u.getUTCHours()>=12?"PM":"AM",e.time.hours=u.getUTCHours()>12?u.getUTCHours()-12:u.getUTCHours(),e.time.minutes=u.getUTCMinutes(),e.time.hours=e.time.hours<10?"0"+e.time.hours:e.time.hours,e.time.minutes=e.time.minutes<10?"0"+e.time.minutes:e.time.minutes,0===e.time.hours&&"AM"===e.time.meridian&&(e.time.hours=12),t.show({templateUrl:"ionic-timepicker-12-hour.html",title:e.titleLabel,subTitle:"",scope:e,buttons:[{text:e.closeLabel,type:e.closeButtonType,onTap:function(t){e.inputObj.callback(void 0)}},{text:e.setLabel,type:e.setButtonType,onTap:function(t){e.loadingContent=!0;var i=0;i=12!=e.time.hours?60*e.time.hours*60+60*e.time.minutes:60*e.time.minutes,"AM"===e.time.meridian?i+=0:"PM"===e.time.meridian&&(i+=43200),e.etime=i,e.inputObj.callback(e.etime)}}]})):24==s.format&&(e.time.hours=u.getUTCHours(),e.time.minutes=u.getUTCMinutes(),e.time.hours=e.time.hours<10?"0"+e.time.hours:e.time.hours,e.time.minutes=e.time.minutes<10?"0"+e.time.minutes:e.time.minutes,t.show({templateUrl:"ionic-timepicker-24-hour.html",title:e.titleLabel,subTitle:"",scope:e,buttons:[{text:e.closeLabel,type:e.closeButtonType,onTap:function(t){e.inputObj.callback(void 0)}},{text:e.setLabel,type:e.setButtonType,onTap:function(t){e.loadingContent=!0;var i=0;i=24!=e.time.hours?60*e.time.hours*60+60*e.time.minutes:60*e.time.minutes,e.etime=i,e.inputObj.callback(e.etime)}}]}))})}}}angular.module("ionic-timepicker").directive("ionicTimepicker",t),t.$inject=["$ionicPopup"]}();