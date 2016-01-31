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
	$scope.askQuestion = {"email":localStorage.getItem('email'), "userId":localStorage.getItem('userId'),"question":"","questionTag":"","isDirect":false,"moneyType":"1yearly"}
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
						$scope.showMessage(data1.error.message);
						$scope.hideLoader();
					});
				},function(data){
					$scope.showMessage(data.error.message);
					$scope.hideLoader();
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
						$scope.showMessage(data1.error.message);
						$scope.hideLoader();
					});
				},function(data){
					$scope.showMessage(data.error.message);
					$scope.hideLoader();
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
}]);

askmonkApp.filter('timeLineFiter', function(){
	return function(input){
		if(input>6){
			return parseInt(input/12)==1?parseInt(input/12)+'  Year':parseInt(input/12)+'  Years';
		}else{
			return input+' Months';
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