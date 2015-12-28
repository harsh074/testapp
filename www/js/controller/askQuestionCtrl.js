askmonkApp.controller('askQuestionCtrl', ['$scope','$state','utility','$ionicScrollDelegate','$timeout','CONSTANT','$ionicPopup', function($scope, $state,utility,$ionicScrollDelegate,$timeout,CONSTANT,$ionicPopup){

	$scope.$on('$ionicView.enter', function(){
    $scope.showLoader();
  });
  
	$scope.showQuestion = true;
	$scope.askQuestion = {"email":localStorage.getItem('email'), "userId":localStorage.getItem('userId'),"question":"","questionTag":"","walletMoney":0}
	$scope.askOtherQuestion = {"question":null};
	
	utility.getAllQuestion()
	.then(function(data){
		$scope.hideLoader();
		$scope.questions = data;
	},function(data){
		$scope.hideLoader();
		console.log(data);
	});

	$scope.askQuestionCategory = function($index,selectedCategory){
		if(selectedCategory != "other"){
			$scope.askOtherQuestion.question = null;
			$scope.showQuestion = true;
			$scope.preffredQuestion = $scope.questions[selectedCategory];
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
		$ionicScrollDelegate.$getByHandle('scrollHandle').resize();
		if($scope.askQuestion.question == $scope.preffredQuestion[$scope.preffredQuestion.length-1]){
			$scope.askOtherQuestion.question = null;
			$scope.showOnOtherQuestion = true;
			$timeout(function(){
				cordova.plugins.Keyboard.show();
			}, 200);
		}else{
			$scope.askOtherQuestion.question = null;
			$scope.showOnOtherQuestion = false;
			$timeout(function(){
				$ionicScrollDelegate.$getByHandle('scrollHandle').resize();
			}, 250);
		}
	}

	$scope.expandText = function(){
		var element = document.getElementById("askQuestionTextarea");
		element.style.height =  element.scrollHeight + "px";
	}

	$scope.openAskQuestion = function(){
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
	     	$scope.askQuestionButton();
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

		if($scope.askQuestion.question){
			utility.askQuestion($scope.askQuestion)
			.then(function(data){
				$state.go('app.dashboard');
				$scope.transitionAnimation('left');
			},function(data){
				$scope.showMessage(data.error.message);
				$scope.hideLoader();
			});
		}else{
			$scope.hideLoader();
		}
	}

	$scope.cancelAskQuestion = function(){
		$state.go('app.dashboard');
	}
}]);