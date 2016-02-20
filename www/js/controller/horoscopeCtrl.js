askmonkApp.controller('horoscopeCtrl', ['$scope', '$ionicModal','$state', function($scope, $ionicModal,$state) {
	$scope.zodiacSigns = [
		{
			id: 1,
			name: "Aries",
			imagePath: "img/moonSign/icon-sign-1.svg"
		}, {
			id: 2,
			name: "Taurus",
			imagePath: "img/moonSign/icon-sign-2.svg"
		}, {
			id: 3,
			name: "Gemini",
			imagePath: "img/moonSign/icon-sign-3.svg"
		}, {
			id: 4,
			name: "Cancer",
			imagePath: "img/moonSign/icon-sign-4.svg"
		}, {
			id: 5,
			name: "Leo",
			imagePath: "img/moonSign/icon-sign-5.svg"
		}, {
			id: 6,
			name: "Virgo",
			imagePath: "img/moonSign/icon-sign-6.svg"
		}, {
			id: 7,
			name: "Libra",
			imagePath: "img/moonSign/icon-sign-7.svg"
		}, {
			id: 8,
			name: "Scorpio",
			imagePath: "img/moonSign/icon-sign-8.svg"
		}, {
			id: 9,
			name: "Sagittarius",
			imagePath: "img/moonSign/icon-sign-9.svg"
		}, {
			id: 10,
			name: "Capricorn",
			imagePath: "img/moonSign/icon-sign-10.svg"
		}, {
			id: 11,
			name: "Aquarius",
			imagePath: "img/moonSign/icon-sign-11.svg"
		}, {
			id: 12,
			name: "Pisces",
			imagePath: "img/moonSign/icon-sign-12.svg"
		}
	];

	$scope.clickedSign = function(id) {
		$scope.signId = angular.copy(id);
		$scope.showLoader();
		$ionicModal.fromTemplateUrl('views/singleHoroscopeModal.html', function (modal) {
      $scope.singleHoroscopeModal = modal;
      $scope.singleHoroscopeModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
	}
	$scope.closeModal = function(){
		if ($scope.singleHoroscopeModal && $scope.singleHoroscopeModal.isShown()) {
      $scope.singleHoroscopeModal.remove();
    }
	}
  $scope.askQuestion = function(){
  	$scope.closeModal();
  	$state.go('app.askQuestion');
		$scope.transitionAnimation('left',700);
  }
}]);

askmonkApp.controller('singleHoroscopeModalCtrl', ['$scope', 'utility','$timeout', function($scope, utility,$timeout) {
	utility.getHoroscope($scope.signId)
	.then(function(data) {
		$scope.hideLoader();
		$scope.detailHoroscope = data;
		$timeout(function(){
	    $scope.floatingBtnAction = true;
	  },10);
	}, function(data) {
		$scope.hideLoader();
		if(data && data.error.statusCode == 422){
      $scope.showMessage(data.error.message);
    }else{
      $scope.showMessage("Something went wrong. Please try again.");
    }
		// console.log("error", data);
	});
}]);
