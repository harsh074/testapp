askmonkApp.controller('dashboardCtrl', ['$scope','$state','utility','$ionicScrollDelegate','$timeout', function($scope, $state, utility,$ionicScrollDelegate,$timeout){

	$scope.noQuestionFound = false;
	$scope.data = {"search":""};

  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });
  $scope.hideLoader();

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion',{},{"reload":true})
  }

  // utility.getUserQuestions()
  // .then(function(data){
  // 	console.log(data);
  // },function(data){
  // 	console.log(data);
  // });

	$scope.groups = [{
		"question":"Tell future?",
		"answer":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui. Quisque nec mauris sit amet elit iaculis pretium sit amet quis magna. Aenean velit odio, elementum in tempus ut, vehicula eu diam. Pellentesque rhoncus aliquam mattis. Ut vulputate eros sed felis sodales nec vulputate justo hendrerit. Vivamus varius pretium ligula, a aliquam odio euismod sit amet. Quisque laoreet sem sit amet orci ullamcorper at ultricies metus viverra. Pellentesque arcu mauris, malesuada quis ornare accumsan, blandit sed diam.",
		"rating":4
	},{
		"question":"Tell future?",
		"answer":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui. Quisque nec mauris sit amet elit iaculis pretium sit amet quis magna. Aenean velit odio, elementum in tempus ut, vehicula eu diam. Pellentesque rhoncus aliquam mattis. Ut vulputate eros sed felis sodales nec vulputate justo hendrerit. Vivamus varius pretium ligula, a aliquam odio euismod sit amet. Quisque laoreet sem sit amet orci ullamcorper at ultricies metus viverra. Pellentesque arcu mauris, malesuada quis ornare accumsan, blandit sed diam.",
		"rating":4
	}];

  $scope.showLimit = 100;
  $scope.toggleGroup = function(group,$index) {
  	$timeout(function(){
  		$ionicScrollDelegate.$getByHandle('mainScroll').resize();
  		if($index>0){
  			var topScrollPosition = $index*155;
  			$ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, topScrollPosition, true);
  		}
  	}, 10);
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
      $scope.showLimit = 100;
    } else {
    	if(group.answer){
    		$scope.showLimit = group.answer.length+1;
      	$scope.shownGroup = group;
    	}
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.clearSearch = function(data){
		// $scope.data.search = "harsh";
		console.log(data);
	};

}]);