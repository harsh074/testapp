askmonkApp.controller('singleQuestionCtrl', ['$scope','$state','utility','$timeout','$stateParams', function($scope, $state, utility,$timeout,$stateParams){

  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });

  $scope.askQuestion = function(){
    $scope.showLoader();
  	$state.go('app.askQuestion');
    window.plugins.nativepagetransitions.slide(
      {"direction":"left"},
      function (msg) {console.log("success: " + msg)}, // called when the animation has finished
      function (msg) {alert("error: " + msg)} // called in case you pass in weird values
    );
  }

  utility.getSingleQuestions($stateParams.id)
  .then(function(data){
  	console.log(data);
    $scope.hideLoader();
    $scope.question = data;
  },function(data){
    $scope.hideLoader();
  	console.log(data);
  });

}]);