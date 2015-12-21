askmonkApp.controller('settingCtrl', ['$scope','utility','$ionicHistory','$rootScope','$http','$state','$templateCache', function($scope,utility,$ionicHistory,$rootScope,$http,$state,$templateCache){
  $scope.logout = function(){
    $scope.showLoader();
  	utility.logout()
    .then(function(data){
      $scope.hideLoader();
      $state.go('login');
      $scope.transitionAnimation('left');
      $scope.setAuth(false);
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      var currentPageTemplate = $state.current.templateUrl;
      $templateCache.remove(currentPageTemplate);
      $rootScope.profileData = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem('loginType');
      $scope.loginType = localStorage.getItem('loginType');
      delete $http.defaults.headers.common.Authorization;
    },function(data){
      console.log(data,'error');
    });
  }

}]);