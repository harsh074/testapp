askmonkApp.controller('dashboardCtrl', ['$scope','$state','utility','$timeout','$stateParams','CONSTANT','$ionicSlideBoxDelegate','$ionicGesture','$ionicScrollDelegate', function($scope, $state, utility,$timeout,$stateParams,CONSTANT,$ionicSlideBoxDelegate,$ionicGesture,$ionicScrollDelegate){

	$scope.noQuestionFound = false;
	$scope.search = {"searchInput":""};
  $scope.question = {"askedQuestion":[],"answeredQuestion":[],"ratedQuestion":[]};

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

  $scope.questionSorted = function(data) {
    $scope.question = {"askedQuestion":[],"answeredQuestion":[],"ratedQuestion":[]};
    angular.forEach(data,function (value,key) {
      if(value.status=='asked' || value.status=='direct'){
        $scope.question.askedQuestion.push(value);
      }else if(value.status=='answered'){
        $scope.question.answeredQuestion.push(value);
      }else{
        $scope.question.ratedQuestion.push(value);
      }
    });
  }

  $scope.questionSortedMonk = function(data,status){
    if(status=='asked'){
      $scope.question.askedQuestion=[];
    }else if(status=='answered'){
      $scope.question.answeredQuestion=[];
      $scope.question.ratedQuestion=[];
    }else{
      $scope.question = {"askedQuestion":[],"answeredQuestion":[],"ratedQuestion":[]};
    }
    angular.forEach(data,function (value,key) {
      if(value.status=='asked'){
        $scope.question.askedQuestion.push(value);
      }else if(value.status=='answered'){
        $scope.question.answeredQuestion.push(value);
      }else{
        $scope.question.ratedQuestion.push(value);
      }
    });
  }  

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
    $scope.transitionAnimation('left',180);
  }

  if($scope.loginType == "user"){
    utility.getUserQuestions()
    .then(function(data){
      $scope.hideLoader();
      if(data.length>0){
        $scope.questionSorted(data);
        // $scope.groups = data;
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
        // $scope.groups = data;
        // $scope.questionSorted(data);
      }else{
        $scope.noQuestionFound = true
      }
      utility.getMonkAnsweredQuestion()
      .then(function(data1){
        $scope.hideLoader();
        // $scope.questionAnswered = data1;
        $scope.questionSortedMonk(data1.concat(data),null);
      },function(data1){
        $scope.hideLoader();
        console.log(data1)
      });
    },function(data){
      $scope.hideLoader();
      console.log(data);
    });
  }


  // For user
  $scope.doRefresh = function() {
    if($scope.loginType == "user"){
      utility.getUserQuestions()
      .then(function(data){
        console.log(data);
        $scope.$broadcast('scroll.refreshComplete');
        if(data.length>0){
          $scope.questionSorted(data);
        }else{
          $scope.noQuestionFound = true
        }
      },function(data){
        console.log(data);
      });
    }else{
      utility.getQuestionOnStatus('asked')
      .then(function(data){
        $scope.$broadcast('scroll.refreshComplete');
        if(data.length>0){
          $scope.questionSortedMonk(data,'asked');
        }else{
          $scope.noQuestionFound = true
        }
      },function(data){
        console.log(data);
      });
    }
  };

  // For monk
  $scope.doRefreshOnAnsweredTab = function(){
    if($scope.loginType == "user"){
      utility.getUserQuestions()
      .then(function(data){
        console.log(data);
        $scope.$broadcast('scroll.refreshComplete');
        if(data.length>0){
          $scope.questionSorted(data);
        }else{
          $scope.noQuestionFound = true
        }
      },function(data){
        console.log(data);
      });
    }else{
      utility.getMonkAnsweredQuestion()
      .then(function(data){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.questionSortedMonk(data,'answered');
      },function(data){
        console.log(data)
      });
    }
  }
  $scope.slideHasChanged = function($index){
    console.log($index);
  }

  // Go to Single question
  $scope.goToQuestion = function(id){
    $stateParams.id = id;
    $state.go('app.singlequestion',$stateParams);
    $scope.transitionAnimation('left',180);
  }
  
  // Search the input
  $scope.inputSearch = function(){
    if($scope.search.searchInput){
      $scope.showClear = true;
    }else{
      $scope.showClear = false;
    }
  }

  $scope.clearSearch = function(){
		$scope.search.searchInput = "";
    $scope.showClear = false;
	};
}]);