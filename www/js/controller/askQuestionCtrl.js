askmonkApp.controller('askQuestionCtrl', ['$scope','$state','utility','$ionicScrollDelegate','$timeout','CONSTANT','$ionicPopup','$ionicModal', function($scope, $state,utility,$ionicScrollDelegate,$timeout,CONSTANT,$ionicPopup,$ionicModal){

	$scope.$on('$ionicView.enter', function(){
    // $scope.showLoader();
  });
  var element, otherQuestionMargin;
  window.addEventListener('native.keyboardshow', keyboardHandler);
  window.addEventListener('native.keyboardhide', keyboardHandler);
  function keyboardHandler(e){
    $timeout(function(){
			$ionicScrollDelegate.$getByHandle('scrollHandle').resize();
      $ionicScrollDelegate.$getByHandle('scrollHandle').scrollBottom(true);
		}, 150);
  }

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
  };
  
  function datePickerCallback(val){
    $scope.showDate = true;
    if(val){
      $scope.datepickerObject.inputDate = val;
    }else{
      $scope.datepickerObject.inputDate = new Date();
    }
    $scope.args.partnerDOB = angular.copy($scope.datepickerObject.inputDate);
  }

	if($scope.loginType == 'user'){
    utility.getUserCount()
    .then(function(data){
      $scope.getUserCount = data;
    },function(data){
      console.log(data);
    });
		if(!localStorage.timelineJson){
			utility.getTimeLineJson()
	    .then(function(data){
	    	$scope.timeLineJson = data;
	      localStorage.setItem('timelineJson',JSON.stringify(data));
	    },function(data){
	      console.log(data);
	    });
		}else{
			$scope.timeLineJson = JSON.parse(localStorage.timelineJson);
		}
	}
	
	if(localStorage.tagQuestion){
		$scope.questions = JSON.parse(localStorage.getItem('tagQuestion'));
		$scope.hideLoader();
	}else{
		utility.getAllQuestion()
		.then(function(data){
			$scope.hideLoader();
			$scope.questions = data;
			localStorage.setItem('tagQuestion',JSON.stringify(data));
		},function(data){
			$scope.hideLoader();
			console.log(data);
		});
	}

	$scope.selectedTimeline = {'value':"1yearly"};
	$scope.timeLineValueSelected = "12"
	$scope.selectTimelineOption = function(){
		if(!($scope.getUserCount && $scope.getUserCount.totalQuestionsAsked)){
			$scope.showMessage('Free question has fixed duration of 6 months.');
		}else{
			$scope.timeLinePopup = $ionicPopup.show({
		    cssClass:"timelineSelector",
		    title: 'Duration : Rate Card',
		    templateUrl:'selectTimelinPopup.html',
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

	$scope.openAskQuestion = function(){
		console.log($scope.askQuestion.moneyType);
		var confirmPopup = $ionicPopup.show({
	    cssClass:"ios",
	    title: 'Going further would send the question to the astrologers.',
	    template:'Do u wish to continue ?',
	    buttons: [
	      {text: 'Yes',type:'button-ios button-clear',
	        onTap: function(e) {
	          return true;
	        }
	      },
	      {text:'No',type:'button-ios button-clear',
	        onTap: function(e) {
	          return false;
	        }
	      }
	    ]
	  });
	  // angular.element(document.getElementByClassName('backdrop').style('opacity',1));
	  confirmPopup.then(function(res) {
	    if(res) {
	      console.log('You are sure');
	      if($scope.getUserCount.emailVerified){
	     		$scope.askQuestionButton();
	      }else{
	      	// console.log("Please verify your email");
	      	$scope.showMessage("Please verify your email");
	      }
	    } else {
	      console.log('You are not sure');
	    }
	  });
	}
	$scope.money = {"customMoney":""};
	$scope.options = function(){
		$scope.amount = $scope.money.customMoney*100;
		var profileData = JSON.parse(localStorage.profile);
	 	var data = {
	  	description: "Ask Question",
	    currency: 'INR',
	    key: 'rzp_test_2jGmoGfR3KHvoA',
	    amount: $scope.amount,
	    name: 'Askmonk',
	    prefill: {email:profileData.email,contact:profileData.mobile,name:profileData.name},
	    theme: {color: '#00BCD2'}
	  }
	  return data;
	}
	var successCallback = function(payment_id) {
    // alert('payment_id: ' + payment_id);
    if(payment_id){
    	$scope.showLoader();
	    utility.addMoney({'userId':localStorage.userId,'email':localStorage.email,'amount':$scope.amount,'payment_id':payment_id})
	    .then(function(data){
	    	$scope.hideLoader();
	    	$scope.showMessage('Transaction successful');
				localStorage.profile = JSON.stringify(data);
				$scope.askQuestionButton();
	    },function(data){
	    	$scope.showMessage('Something went wrong. Try again');
	    });
	  }else{
			$scope.showMessage('Something went wrong. Try again');
	  }
  }
  var cancalCallback = function(error) {
    // alert(error.description + ' (Error '+error.code+')');
    $scope.showMessage(error.description);
  }	
	$scope.openInsufficientPopup = function(){
		var confirmPopup = $ionicPopup.show({
	    cssClass:"ios",
	    title: 'Insufficient Funds. Please pay to continue asking',
	    template:'<ion-md-input name="addMoney" type="tel" placeholder="Rs." highlight-color="calm" ng-pattern="/^[0-9]+$/" ng-model="money.customMoney" ng-disabled="true"></ion-md-input>',
	    scope:$scope,
	    buttons: [
	      {text: 'Yes',type:'button-ios button-clear',
	        onTap: function(e) {
	          return true;
	        }
	      },
	      {text:'No',type:'button-ios button-clear',
	        onTap: function(e) {
	          return false;
	        }
	      }
	    ]
	  });
	  // angular.element(document.getElementByClassName('backdrop').style('opacity',1));
	  confirmPopup.then(function(res) {
	    if(res) {
	    	RazorpayCheckout.open($scope.options(), successCallback, cancalCallback);
	      console.log('You are sure');
	    } else {
	      console.log('You are not sure');
	    }
	  });
	}

	$scope.askQuestionButton = function(){
		$scope.showLoader();
		if($scope.askOtherQuestion.question){
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
			if(localStorage.getItem('directQuestion')){
				utility.askDirectQuestion($scope.askQuestion)
				.then(function(data){
					utility.getUserCount()
					.then(function(data1){
						var profileData = JSON.parse(localStorage.profile);
						profileData.totalQuestionsAsked = data1.totalQuestionsAsked;
						profileData.walletMoney = data1.walletMoney;
						localStorage.profile = JSON.stringify(profileData);
						$state.go('app.dashboard');
						$scope.transitionAnimation('left');
					},function(data1){
						$scope.hideLoader();
						$scope.showMessage(data1.error.message);
					});
				},function(data){
					$scope.hideLoader();
					$scope.showMessage(data.error.message);
				});
			}else{
				utility.askQuestion($scope.askQuestion)
				.then(function(data){
					utility.getUserCount()
					.then(function(data1){
						var profileData = JSON.parse(localStorage.profile);
						profileData.totalQuestionsAsked = data1.totalQuestionsAsked;
						profileData.walletMoney = data1.walletMoney;
						localStorage.profile = JSON.stringify(profileData);
						$state.go('app.dashboard');
						$scope.transitionAnimation('left');
					},function(data1){
						$scope.hideLoader();
						$scope.showMessage(data1.error.message);
					});
				},function(data){
					$scope.hideLoader();
					if(data.error.message.indexOf('Insufficient Funds') == 0){
						console.log($scope.getUserCount);
						if($scope.getUserCount && $scope.getUserCount.walletMoney){
							$scope.money.customMoney = $scope.timeLineJson[$scope.askQuestion.moneyType].amount - $scope.getUserCount.walletMoney;
						}else{
							$scope.money.customMoney = $scope.timeLineJson[$scope.askQuestion.moneyType].amount;
						}
						$scope.openInsufficientPopup();
					}
					$scope.showMessage(data.error.message);
				});
			}
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
  }
  $scope.goToWalletFromModal = function(){
  	$scope.closeModal();
  	$state.go('app.wallet');
  }

  $scope.changePopValue = function(){
  	$scope.timeLineValueSelected = angular.copy($scope.timeLineJson[$scope.selectedTimeline.value].durationMonths);
  	// console.log($scope.selectedTimeline.value);
  	$timeout(function(){
			$scope.timeLinePopup.close();
		}, 100);
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
  }, 50);
}]);