askmonkApp.controller('loginCtrl', ['$scope','$state','utility', function($scope, $state,utility) {
  $scope.activeUserTab = true;
  $scope.activeMonkTab = false;
  $scope.args = {"email":"","password":""};

  $scope.userLoginForm =function() {
    $scope.activeUserTab = true;
    $scope.activeMonkTab = false;
  }
  $scope.monkLoginForm =function() {
    $scope.activeUserTab = false;
    $scope.activeMonkTab = true;
  }

  $scope.userLogin = function(){
    utility.login($scope.args)
    .then(function(data){
      $scope.setAuth(true);
      $state.go('app.profile');
    },function(data){
      $scope.showError(data.error.message)
    })
  }
  $scope.monkLogin = function(){
    $state.go('app.profile'); 
  }
  $scope.showError = function(errorMessage) {
    window.plugins.toast.showWithOptions(
      {
        message: errorMessage,
        duration: "long",
        position: "bottom",
        addPixelsY: -20  // added a negative value to move it up a bit (default 0)
      },
      function(){
        console.log('sucess');
      }, // optional
      function(){
        console.log('error');
      }    // optional
    );
  }
}]);