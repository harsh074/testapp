askmonkApp.controller('askQuestionCtrl', ['$scope','$state','utility','$ionicScrollDelegate','$timeout','CONSTANT', function($scope, $state,utility,$ionicScrollDelegate,$timeout,CONSTANT){
	$scope.askQuestion = {"category":"","question":""};
	$scope.showQuestion = true;
	utility.getAllQuestion('/questions/tagQuestions')
	.then(function(data){
		$scope.questions = data;
		console.log(data);
	},function(data){
		console.log(data);
	});

	$scope.askQuestionCategory = function($index,selectedCategory){
		if(selectedCategory != "other"){
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
			$scope.showOnOtherQuestion = true;
			$timeout(function(){
				cordova.plugins.Keyboard.show();
			}, 200);
		}else{
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
		$state.go('app.profile');
	}
}]);