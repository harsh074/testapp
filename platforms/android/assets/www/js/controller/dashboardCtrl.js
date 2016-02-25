askmonkApp.controller('dashboardCtrl', ['$scope','$state','utility','$timeout','$stateParams','CONSTANT','$ionicSlideBoxDelegate','$ionicGesture','$ionicScrollDelegate', function($scope, $state, utility,$timeout,$stateParams,CONSTANT,$ionicSlideBoxDelegate,$ionicGesture,$ionicScrollDelegate){

  if(localStorage.questionStatus == 'underObservation'){
    $scope.showArrow = true;
    $state.go('app.singlequestion',{id:localStorage.questionId});
  }
  if(!localStorage.profile){
    $state.go('app.profile');
  }
	$scope.noQuestionFound = false;
	$scope.search = {"searchInput":""};
  $scope.question = {"askedQuestion":[],"answeredQuestion":[],"ratedQuestion":[]};

  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.showLoader();
  });

  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    // $scope.showLoader();
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
  $scope.noMoreAskedQuestion = false;
  $scope.noMoreOtherQuestion = false;
  $scope.showInfinteScroll = false;

  var indexGetAskedQuestion = 0;
  var indexGetOtherQuestion = 0;

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
      if(value.status=='asked' || value.status=='direct' || value.status=='fullAnalysis'){
        $scope.question.askedQuestion.push(value);
      }else if(value.status=='answered'){
        $scope.question.answeredQuestion.push(value);
      }else{
        $scope.question.ratedQuestion.push(value);
      }
    });
  }

  $scope.questionSortedMonk = function(data,status,gettingStatus){
    if(gettingStatus == "pullToRefresh"){
      if(status=='asked'){
        $scope.question.askedQuestion=[];
      }else if(status=='answered'){
        $scope.question.answeredQuestion=[];
        $scope.question.ratedQuestion=[];
      }else{
        $scope.question = {"askedQuestion":[],"answeredQuestion":[],"ratedQuestion":[]};
      }
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
  }

  if($scope.loginType == "user"){
    if(sessionStorage.userQuestion){
      $scope.questionSorted(JSON.parse(sessionStorage.userQuestion));
      utility.getUserCount()
      .then(function(data){
        $scope.hideLoader();
        $scope.getUserCount = data;
      },function(data){
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        // console.log(data);
      });
    }else{
      utility.getUserQuestions()
      .then(function(data){
        $scope.hideLoader();
        if(data.length>0){
          sessionStorage.setItem('userQuestion',JSON.stringify(data));
          $scope.questionSorted(data);
        }
        utility.getUserCount()
        .then(function(data){
          $scope.getUserCount = data;
        },function(data){
          if(data && data.error.statusCode == 422){
            $scope.showMessage(data.error.message);
          }else{
            $scope.showMessage("Something went wrong. Please try again.");
          }
          // console.log(data);
        });
      },function(data){
        $scope.hideLoader();
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        // console.log(data);
      });
    }
  }else{
    utility.getMonkAnsweredQuestion(indexGetOtherQuestion)
    .then(function(data){
      $timeout(function(){
        $scope.hideLoader();
      });
      $scope.questionSortedMonk(data,null,null);
      $timeout(function(){
        $scope.showInfinteScroll = true;
      }, 1000);
    },function(data1){
      $scope.hideLoader();
      if(data1 && data1.error.statusCode == 422){
        $scope.showMessage(data1.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      // console.log(data1)
    });
  }

  // infinite scroll functon for asked question in monk dashboard.
  $scope.loadMoreAskedQuestion = function() {
    indexGetAskedQuestion = indexGetAskedQuestion+10;
    $scope.showLoader();
    utility.getQuestionOnStatus('asked',indexGetAskedQuestion)
    .then(function(data){
      console.log(data,"asked");
      $scope.hideLoader();
      if(data.length==0 && indexGetAskedQuestion>9){
        $scope.noQuestionFound = true;
        $scope.noMoreAskedQuestion = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{
        $scope.questionSortedMonk(data,null,null);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      // console.log(data);
    });
  }

  $scope.loadMoreOtherQuestion = function(){
    indexGetOtherQuestion = indexGetOtherQuestion+10;
    $scope.showLoader();
    utility.getMonkAnsweredQuestion(indexGetOtherQuestion)
    .then(function(data){
      $scope.hideLoader();
      console.log(data,"answered");
      if(data.length==0 && indexGetOtherQuestion>9){
        $scope.noMoreOtherQuestion = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{
        $scope.questionSortedMonk(data,null,null);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data)
    });
  }

  // For user
  $scope.doRefresh = function() {
    indexGetAskedQuestion = 0;
    $scope.noMoreAskedQuestion = false;
    // indexGetOtherQuestion = 10;
    // $scope.noMoreOtherQuestion = false;

    if($scope.loginType == "user"){
      utility.getUserQuestions()
      .then(function(data){
        console.log(data);
        $scope.$broadcast('scroll.refreshComplete');
        if(data.length>0){
          sessionStorage.setItem('userQuestion',JSON.stringify(data));
          $scope.questionSorted(data);
        }else{
          $scope.noQuestionFound = true
        }
      },function(data){
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        console.log(data);
      });
    }else{
      utility.getQuestionOnStatus('asked',indexGetAskedQuestion)
      .then(function(data){
        $scope.$broadcast('scroll.refreshComplete');
        if(data.length>0){
          $scope.questionSortedMonk(data,'asked','pullToRefresh');
        }else{
          $scope.noQuestionFound = true
        }
      },function(data){
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        console.log(data);
      });
    }
  };

  // For monk
  $scope.doRefreshOnAnsweredTab = function(){
    indexGetOtherQuestion = 0;
    $scope.noMoreOtherQuestion = false;
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
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        // console.log(data);
      });
    }else{
      utility.getMonkAnsweredQuestion(indexGetOtherQuestion)
      .then(function(data){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.questionSortedMonk(data,'answered','pullToRefresh');
      },function(data){
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        // console.log(data)
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