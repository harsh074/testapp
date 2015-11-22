askmonkApp.controller('profileCtrl', ['$scope','$state', function($scope, $state){
  
  $scope.profileEdit = function(){
    $state.go('app.editProfile');
  }

}]);