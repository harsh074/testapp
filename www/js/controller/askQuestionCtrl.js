askmonkApp.controller('askQuestionCtrl', ['$scope','$state','utility','$ionicScrollDelegate','$timeout','CONSTANT', function($scope, $state,utility,$ionicScrollDelegate,$timeout,CONSTANT){

	$scope.showLoader();
	$scope.showQuestion = true;
	$scope.askQuestion = {"email":localStorage.getItem('email'), "userId":localStorage.getItem('userId'),"question":"","questionTag":"","walletMoney":0}
	$scope.askOtherQuestion = {"question":null};
	
	utility.getAllQuestion()
	.then(function(data){
		$scope.hideLoader();
		$scope.questions = data;
		// console.log(data);
	},function(data){
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

	$scope.askQuestionButton = function(){
		// $state.go('app.profile');
		if($scope.askOtherQuestion.question){
			$scope.askQuestion.question = null;
			$scope.askQuestion.question = angular.copy($scope.askOtherQuestion.question);
		}

		if($scope.askQuestion.question){
			console.log($scope.askQuestion);
			utility.askQuestion($scope.askQuestion)
			.then(function(data){
				$scope.showLoader();
				$state.go('app.dashboard');
			},function(data){
				$scope.showMessage(data.message);
			});
		}else{
			return;
		}
	}
}]);