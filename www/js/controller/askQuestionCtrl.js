askmonkApp.controller('askQuestionCtrl', ['$scope','$state','utility','$ionicScrollDelegate','$timeout','CONSTANT','$ionicPopup','$ionicModal', function($scope, $state,utility,$ionicScrollDelegate,$timeout,CONSTANT,$ionicPopup,$ionicModal){

  var element, otherQuestionMargin;
  window.addEventListener('native.keyboardshow', keyboardHandler);
  window.addEventListener('native.keyboardhide', keyboardHandler);
  function keyboardHandler(e){
    $timeout(function(){
			$ionicScrollDelegate.$getByHandle('scrollHandle').resize();
      $ionicScrollDelegate.$getByHandle('scrollHandle').scrollBottom(true);
		}, 150);
  }
	
	$timeout(function(){
		if(CONSTANT.googleAnalyticsStatus){
    	analytics.trackView("Ask Question Page");
		}
	}, 1500);
  
  $scope.args = {"partnerName":"","partnerBirthPlace":"","partnerBirthTime":"","partnerDOB":"","partnerGender":""};
	$scope.showQuestion = true;
	$scope.askQuestion = {"email":localStorage.getItem('email'), "userId":localStorage.getItem('userId'),"question":"","questionTag":"","isDirect":false,"moneyType":""}
	$scope.askOtherQuestion = {"question":null};
	$scope.showOnOtherQuestion = false;

	$scope.datepickerObject = {
    titleLabel: 'DOB',
    todayLabel: 'Today',
    closeLabel: 'Close',
    setLabel: 'Set',
    setButtonType : 'button-askmonk',
    todayButtonType : 'button-askmonk',
    closeButtonType : 'button-askmonk',
    inputDate: $scope.args.partnerDOB ? new Date($scope.args.partnerDOB):new Date(),
    mondayFirst: true,
    templateType: 'popup',
    showTodayButton: 'false',
    modalHeaderColor: 'bar-positive',
    modalFooterColor: 'bar-positive',
    from: new Date(1940, 1, 1),
    to: new Date(),
    callback: function (val) {
      datePickerCallback(val);
    },
    dateFormat: 'dd-MM-yyyy',
    closeOnSelect: true
  }
  
  function datePickerCallback(val){
    $scope.showDate = true;
    if(val){
      $scope.datepickerObject.inputDate = val;
    }else{
      $scope.datepickerObject.inputDate = new Date();
    }
    $scope.args.partnerDOB = angular.copy($scope.datepickerObject.inputDate);
  }

  $scope.timePickerObject12Hour = {
    inputEpochTime:($scope.args.partnerBirthTime?(new Date($scope.args.partnerBirthTime)).getHours()*60*60+60*(new Date($scope.args.partnerBirthTime)).getMinutes():(new Date()).getHours()*60*60),
    step: 1,
    format: 12,
    titleLabel: 'Partner Birth Time',
    closeLabel: 'Close',
    setLabel: 'Set',
    setButtonType: 'button-askmonk',
    closeButtonType: 'button-askmonk',
    callback: function (val) {
      timePicker12Callback(val);
    }
  }

  $scope.timePicker12Callback = function(val){
    angular.element(document.getElementsByClassName('ion-birth-time')).addClass('used');
  }

	if($scope.loginType == 'user'){
		$scope.showLoader();
    utility.getUserCount()
    .then(function(data){
			$scope.hideLoader();
			console.log(data);
      $scope.getUserCount = data;
    },function(data){
			if(data.error.statusCode == 422){
				$scope.showMessage(data.error.message);
			}
			$scope.hideLoader();
      console.log(data);
    });
		if(!localStorage.timelineJson){
			utility.getTimeLineJson()
	    .then(function(data){
	    	$scope.timeLineJson = data;
	      localStorage.setItem('timelineJson',JSON.stringify(data));
	    },function(data){
	    	if(data.error.statusCode == 422){
					$scope.showMessage(data.error.message);
				}
	      console.log(data);
	    });
		}else{
			$scope.timeLineJson = JSON.parse(localStorage.timelineJson);
		}
	}
	
	if(localStorage.tagQuestion){
		$scope.questions = JSON.parse(localStorage.getItem('tagQuestion'));
		// $scope.hideLoader();
	}else{
		$scope.showLoader();
		utility.getAllQuestion()
		.then(function(data){
			// $scope.hideLoader();
			$scope.questions = data;
			localStorage.setItem('tagQuestion',JSON.stringify(data));
		},function(data){
			if(data.error.statusCode == 422){
				$scope.showMessage(data.error.message);
			}
			$scope.hideLoader();
			console.log(data);
		});
	}

	$scope.selectedTimeline = {'value':"basic"};
	$scope.timeLineValueSelected = "6";
	$scope.selectTimelineOption = function(){
		if($scope.getUserCount.totalQuestionsAsked == 0){
			if(!$scope.getUserCount.makeFirstQuestionHalfRate && $scope.getUserCount.makeFirstQuestionFree){
				$scope.showMessage('Free question has fixed duration of 6 months');
			}else{
				$scope.timeLinePopup = $ionicPopup.show({
			    cssClass:"timelineSelector",
			    title: 'Duration : Rate Card',
			    templateUrl:'selectTimelinePopup.html',
			    scope: $scope
			  });
			}
		}else{
			$scope.timeLinePopup = $ionicPopup.show({
		    cssClass:"timelineSelector",
		    title: 'Duration : Rate Card',
		    templateUrl:'selectTimelinePopup.html',
		    scope: $scope
		  });
		}
	}

	$scope.askQuestionCategory = function($index,selectedCategory){
		$scope.askQuestion.question = "";
		$scope.showOnOtherQuestion = false;
		if(selectedCategory != "other"){
			$scope.askOtherQuestion.question = null;
			$scope.showQuestion = true;
			$scope.preffredQuestion = angular.copy($scope.questions[selectedCategory]);
			$timeout(function(){
				$ionicScrollDelegate.$getByHandle('scrollHandle').resize();
			}, 250);
		}else{
			$scope.showQuestion = false;
			$timeout(function(){
				cordova.plugins.Keyboard.show();
			}, 200);
		}
	}

	$scope.clearQuestionOnOther = function(){
		// $ionicScrollDelegate.$getByHandle('scrollHandle').resize();
		if($scope.askQuestion.question == $scope.preffredQuestion[$scope.preffredQuestion.length-1]){
			$scope.askOtherQuestion.question = null;
			$scope.showOnOtherQuestion = true;
      // $ionicScrollDelegate.$getByHandle('scrollHandle').scrollBottom(true);

		}else{
			$scope.askOtherQuestion.question = null;
			$scope.showOnOtherQuestion = false;
			$timeout(function(){
				$ionicScrollDelegate.$getByHandle('scrollHandle').resize();
			}, 250);
			angular.element(otherQuestionMargin).css('margin-bottom',"0px")
		}
	}

	$scope.addPartnerDetailsModal = function(){
		$ionicModal.fromTemplateUrl('views/partnerDetailsModal.html', function (modal) {
      $scope.partnerDetailsModal = modal;
      $scope.partnerDetailsModal.show();
    },{
      scope: $scope,
      animation: 'slide-in-up',
      hardwareBackButtonClose: true
    });
	}

	$scope.startPostingQuestion = function(paymentId,transactionId,paymentType) {
		// if(CONSTANT.PRODUCTION_MODE){
	 //  	$scope.amount = $scope.timeLineJson[$scope.askQuestion.moneyType].amount;
		// }else{
			$scope.amount = 1;
		// }
  	var options = {'userId':localStorage.userId,'email':localStorage.email,'amount':$scope.amount,'paymentId':paymentId,'transactionId':transactionId,'paymentType':paymentType};

    utility.addMoney(options)
    .then(function(data){
			localStorage.profile = JSON.stringify(data);
			$scope.askQuestionButton();
    	$scope.showMessage('Transaction successful');
    },function(data){
    	$scope.hideLoader();
    	alert(JSON.stringify(data));
    	if(data){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
    });	  
  }

	$scope.askQuestionButton = function(){
		if(localStorage.getItem('directQuestion')){
			utility.askDirectQuestion($scope.askQuestion)
			.then(function(data){
				utility.getUserCount()
				.then(function(data1){
					var profileData = JSON.parse(localStorage.profile);
					profileData.totalQuestionsAsked = data1.totalQuestionsAsked;
					profileData.walletMoney = data1.walletMoney;
					localStorage.profile = JSON.stringify(profileData);
					localStorage.setItem('updateDashboard',true);
					$scope.hideLoader();
					$scope.closeModal();
					$state.go('app.dashboard');
					$scope.showMessage("Your question has been posted successfully")
				},function(data1){
					$scope.hideLoader();
					if(data1 && data1.error.statusCode == 422){
						$scope.showMessage(data1.error.message);
		      }else{
		        $scope.showMessage("Something went wrong. Please try again.");
		      }
				});
			},function(data){
				$scope.hideLoader();
				if(data && data.error.statusCode == 422){
	        $scope.showMessage(data.error.message);
	      }else{
	        $scope.showMessage("Something went wrong. Please try again.");
	      }
			});
		}else{
			utility.askQuestion($scope.askQuestion)
			.then(function(data){
				utility.getUserCount()
				.then(function(data1){
					var profileData = JSON.parse(localStorage.profile);
					profileData.totalQuestionsAsked = data1.totalQuestionsAsked;
					profileData.walletMoney = data1.walletMoney;
					localStorage.setItem('updateDashboard',true);
					localStorage.profile = JSON.stringify(profileData);
					$scope.hideLoader();
					$scope.closeModal();
					$state.go('app.dashboard');
				},function(data1){
					$scope.hideLoader();
					if(data1 && data1.error.statusCode == 422){
		        $scope.showMessage(data1.error.message);
		      }else{
		        $scope.showMessage("Something went wrong. Please try again.");
		      }
				});
			},function(data){
				$scope.hideLoader();
				if(data && data.error.statusCode == 422){
	        $scope.showMessage(data.error.message);
	      }else{
	        $scope.showMessage("Something went wrong. Please try again.");
	      }
			});
		}
	}

	$scope.goTopaymentModal = function(){
		if(!$scope.getUserCount.emailVerified){
    	$scope.showMessage("Please verify your email");
    	return;
    }
		if($scope.askOtherQuestion.question){
			if($scope.askOtherQuestion.question.length<10){
        $scope.showMessage("Minimum character length is 10.");
        return;
      }
			$scope.askQuestion.question = null;
			$scope.askQuestion.question = angular.copy($scope.askOtherQuestion.question);
			$scope.hideLoader();
		}
		if(localStorage.getItem('directQuestion')){
			angular.extend($scope.askQuestion, JSON.parse(localStorage.getItem('directQuestion')));
		}
		if($scope.askQuestion.questionTag == "Match Making"){
			if(!$scope.args.partnerName || !$scope.args.partnerBirthPlace || !$scope.args.partnerBirthTime || !$scope.args.partnerDOB || !$scope.args.partnerGender){
				$scope.hideLoader();
				$scope.addPartnerDetailsModal();
				$scope.showMessage("Partner details are required");
				return;
			}else{
				$scope.askQuestion.matchMakingDetails = angular.copy($scope.args);
			}
		}
		
		if($scope.askQuestion.question){
			$scope.askQuestion.moneyType = angular.copy($scope.selectedTimeline.value);
			$ionicModal.fromTemplateUrl('views/paymentDetailsModal.html', function (modal) {
	      $scope.paymentDetailsModal = modal;
	      $scope.paymentDetailsModal.show();
	    },{
	      scope: $scope,
	      animation: 'slide-in-right',
	      hardwareBackButtonClose: true
	    });
		}else{
			$scope.hideLoader();
			$scope.showMessage("Please ask the desired question");
		}
	}

	$scope.cancelAskQuestion = function(){
		$state.go('app.dashboard');
	}

	$scope.closeModal = function(){
    if($scope.partnerDetailsModal && $scope.partnerDetailsModal.isShown()){
      $scope.partnerDetailsModal.remove();
    }
    if($scope.paymentDetailsModal && $scope.paymentDetailsModal.isShown()){
      $scope.paymentDetailsModal.remove();
    }
  }

  $scope.changePopValue = function(){
  	$scope.timeLineValueSelected = angular.copy($scope.timeLineJson[$scope.selectedTimeline.value].durationMonths);
  	$timeout(function(){
			$scope.timeLinePopup.close();
		}, 100);
  }
}]);

askmonkApp.controller('paymentDetailsModalCtrl', ['$scope','base64Encoding','CONSTANT', function($scope,base64Encoding,CONSTANT){
	$scope.paymentAskQuestion =  angular.copy($scope.askQuestion);
	var selectedTimeline = $scope.timeLineJson[$scope.paymentAskQuestion.moneyType];
	
	// $scope.getUserCount = {makeFirstQuestionFree: true, makeFirstQuestionHalfRate: false, emailVerified: true, totalQuestionsAsked: 0, totalQuestionsRated: 0}
	$scope.freeQuestion = ($scope.getUserCount.makeFirstQuestionFree && !$scope.getUserCount.makeFirstQuestionHalfRate && $scope.getUserCount.totalQuestionsAsked==0) ? true : false;
	$scope.halfRateQuestion = ($scope.getUserCount.makeFirstQuestionHalfRate && !$scope.getUserCount.makeFirstQuestionFree && $scope.getUserCount.totalQuestionsAsked == 0) ? true : false
	
	// console.log($scope.freeQuestion,$scope.halfRateQuestion);
	// console.log(selectedTimeline,$scope.getUserCount);
	
	$scope.totalAmount = selectedTimeline.amount;
	if($scope.freeQuestion){
		$scope.totalAmount = 0;
	}
	if($scope.halfRateQuestion){
		$scope.totalAmount = selectedTimeline.amount/2;
	}
	$scope.serviceTax = $scope.totalAmount*0.15;
	$scope.basicCost = $scope.totalAmount - $scope.serviceTax;


	$scope.payWithPayU = function(){
		$scope.showLoader();
		// TODO: payUId ain place of 121195
		var paymentId;
		// if(CONSTANT.PRODUCTION_MODE){
		// 	var ref = window.open('https://www.payumoney.com/paybypayumoney/#/'+selectedTimeline.payUId, '_blank', 'location=no');
		// }else{
			var ref = window.open('https://www.payumoney.com/paybypayumoney/#/121195', '_blank', 'location=no');
		// }
    ref.addEventListener('loadstart', function(event) { 
      if(event.url.indexOf('payumoney') > -1){
        if(event.url.indexOf('payment/notification/success') > -1){
          paymentId = event.url.split('/')[event.url.split('/').length-1];
          var paymentType = "payUMoney";
          var transactionId = '121195-'+paymentId;
      		ref.close();
      		$scope.startPostingQuestion(paymentId,transactionId,paymentType);
        }else if(event.url.indexOf('error') >-1){
        	ref.close();
        }
      }
    });
    ref.addEventListener('exit', function(event) {
    	if(typeof paymentId =='undefined' || !paymentId){
    		$scope.hideLoader();
    		$scope.showMessage('Transaction Cancelled');
    	};
    });
	}

	var successCallback = function(data){
		console.log(data);
    var paymentType = "paytm";
		var transactionId = data.ORDERID;
		var paymentId = data.TXNID;
		$scope.startPostingQuestion(paymentId,transactionId,paymentType);
	}

	var failureCallback = function(data){
		$scope.hideLoader();
		console.log(data);
	}

	$scope.payWithPayTm = function(){
		$scope.showLoader();
		var order_id = base64Encoding.encode("ASKMONK|"+Date.now())
		var customer_id = localStorage.userId;
		var email = localStorage.email;
		var phone = JSON.parse(localStorage.profile).mobile;
		var amount = $scope.totalAmount;
		window.plugins.paytm.startPayment(order_id, customer_id, email, phone, amount, successCallback, failureCallback);
	}

	// Post free question Directly
	$scope.postFreeQuestion = function(){
		$scope.showLoader();
		$scope.askQuestionButton()
	}

}]);

askmonkApp.filter('timeLineFiter',function(){
	return function(input){
		if(input == 6){
			return '1/2 Year';
		}else{
			return parseInt(input/12)==1?parseInt(input/12)+'  Year':parseInt(input/12)+'  Years';
		}
	}
});

askmonkApp.controller('partnerDetailsModal', ['$scope','$timeout', function($scope,$timeout){
	$timeout(function(){
    if($scope.args.partnerBirthPlace){
      angular.element(document.getElementsByClassName('ion-google-place')).addClass('used');
    }
    if($scope.args.partnerBirthTime){
        angular.element(document.getElementsByClassName('ion-birth-time')).addClass('used');
      }
  }, 50);
}]);