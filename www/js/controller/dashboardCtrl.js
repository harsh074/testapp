askmonkApp.controller('dashboardCtrl', ['$scope','$state','utility','$timeout','$stateParams','CONSTANT','$ionicSlideBoxDelegate','$ionicGesture','$ionicScrollDelegate', function($scope, $state, utility,$timeout,$stateParams,CONSTANT,$ionicSlideBoxDelegate,$ionicGesture,$ionicScrollDelegate){

	$scope.noQuestionFound = false;
	$scope.search = {"searchInput":""};

  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });
  window.addEventListener('native.keyboardshow', keyboardHandler);
  window.addEventListener('native.keyboardhide', keyboardHandler);
  function keyboardHandler(e){
    if(e.type=="native.keyboardshow"){
      $scope.floatingBtnAction = false;
    }else{
      $scope.floatingBtnAction = true;
    }
  }
  $scope.loginType = CONSTANT.loginType;
  $scope.showClear = false;

  $timeout(function(){
    $ionicSlideBoxDelegate.$getByHandle('sliderScroll').enableSlide(false);
      $ionicGesture.on('swiperight', function(e){
        if($ionicSlideBoxDelegate.$getByHandle('sliderScroll').currentIndex() == 1){
          $ionicSlideBoxDelegate.$getByHandle('sliderScroll').previous();
          $ionicScrollDelegate.$getByHandle('slide1Scroll').scrollTop(true);
        }else if($ionicSlideBoxDelegate.$getByHandle('sliderScroll').currentIndex() == 2){
          $ionicSlideBoxDelegate.$getByHandle('sliderScroll').previous();
          $ionicScrollDelegate.$getByHandle('slide2Scroll').scrollTop(true);
        }
      }, angular.element(document.querySelector('#sliderScroll')));
      $ionicGesture.on('swipeleft', function(e){
        if($ionicSlideBoxDelegate.$getByHandle('sliderScroll').currentIndex() == 0){
          $ionicSlideBoxDelegate.$getByHandle('sliderScroll').next();
          $ionicScrollDelegate.$getByHandle('slide2Scroll').scrollTop(true);
        }else if($ionicSlideBoxDelegate.$getByHandle('sliderScroll').currentIndex() == 1){
          $ionicSlideBoxDelegate.$getByHandle('sliderScroll').next();
          $ionicScrollDelegate.$getByHandle('slide3Scroll').scrollTop(true);
        }
      }, angular.element(document.querySelector('#sliderScroll')));
  },500);

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
    $scope.transitionAnimation('left',180);
  }

  $scope.doRefresh = function() {
    $scope.showLoader();
    $scope.$broadcast('scroll.refreshComplete');
    if($scope.loginType == "user"){
      utility.getUserQuestions()
      .then(function(data){
        console.log(data);
        $scope.hideLoader();
        if(data.length>0){
          $scope.groups = data;
        }else{
          $scope.noQuestionFound = true
        }
      },function(data){
        $scope.hideLoader();
        console.log(data);
      });
    }else{
      utility.getQuestionOnStatus('asked')
      .then(function(data){
        $scope.hideLoader();
        console.log(data);
        if(data.length>0){
          $scope.groups = data;
        }else{
          $scope.noQuestionFound = true
        }
      },function(data){
        $scope.hideLoader();
        console.log(data);
      });
    }
  };

  $scope.doRefreshOnAnsweredTab = function(){
    $scope.showLoader();
    $scope.$broadcast('scroll.refreshComplete');
    if($scope.loginType == "user"){
      utility.getUserQuestions()
      .then(function(data){
        console.log(data);
        $scope.hideLoader();
        if(data.length>0){
          $scope.groups = data;
        }else{
          $scope.noQuestionFound = true
        }
      },function(data){
        $scope.hideLoader();
        console.log(data);
      });
    }else{
      utility.getMonkAnsweredQuestion()
      .then(function(data){
        $scope.hideLoader();
        $scope.questionAnswered = data;
      },function(data){
        $scope.hideLoader();
        console.log(data)
      });
    }
  }
  $scope.slideHasChanged = function($index){
    console.log($index);
  }

  if($scope.loginType == "user"){
    utility.getUserQuestions()
    .then(function(data){
    	console.log(data);
      $scope.hideLoader();
      if(data.length>0){
        $scope.groups = data;
      }else{
        $scope.noQuestionFound = true
      }
    },function(data){
      $scope.hideLoader();
    	console.log(data);
    });
  }else{
    utility.getQuestionOnStatus('asked')
    .then(function(data){
      if(data.length>0){
        $scope.groups = data;
      }else{
        $scope.noQuestionFound = true
      }
      utility.getMonkAnsweredQuestion()
      .then(function(data1){
        $scope.hideLoader();
        $scope.questionAnswered = data1;
      },function(data1){
        $scope.hideLoader();
        console.log(data1)
      });
    },function(data){
      $scope.hideLoader();
      console.log(data);
    });
  }

  $scope.goToQuestion = function(id){
    $stateParams.id = id;
    $state.go('app.singlequestion',$stateParams);
    $scope.transitionAnimation('left',180);
  }
  
  $scope.inputSearch = function(){
    if($scope.search.searchInput){
      $scope.showClear = true;
    }else{
      $scope.showClear = false;
    }
  }

  $scope.clearSearch = function(){
		$scope.search.searchInput = "";
	};
}]);