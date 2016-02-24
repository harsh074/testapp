askmonkApp.controller('profileCtrl', ['$scope','$state','utility','CONSTANT','$rootScope','$timeout','$ionicPopup','$stateParams','$ionicModal', function($scope, $state, utility,CONSTANT,$rootScope,$timeout,$ionicPopup,$stateParams,$ionicModal){
  
  $scope.floatingBtnAction = false;
	$scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    // $scope.showLoader();
    if(CONSTANT.isDevice){
      cordova.plugins.Keyboard.close();
    }
  });

  var indexGetQuestion = 0;
  $scope.noMoreQuestion = false;

  $scope.loginType = CONSTANT.loginType;

  if(localStorage.getItem("profile")){
    $rootScope.profileData = JSON.parse(localStorage.getItem("profile"));
    $scope.profileInfo = angular.copy($rootScope.profileData);
    if($scope.loginType == "user"){
      $scope.profileImage = 'img/moonSign/'+$scope.profileInfo.moonSign+'.png';
      $timeout(function(){
        $scope.getBroadcastQuestion();
      });
    }else{
      $scope.profileImage = 'http://askmonk.in/mImages/'+$scope.profileInfo.email.split('@')[0].toLowerCase()+'.jpg';
    }
  }else{
    if($scope.loginType == "user"){
      utility.getUserProfile(localStorage.getItem('userId'))
      .then(function(data){
        localStorage.setItem("email",data.email);
        localStorage.setItem("name",data.name);
        $scope.$emit("updateSideMenuName",data);
      	$rootScope.profileData = data;
      	if(!data.dob || !data.birthPlace || !data.birthTime || !data.gender){
          localStorage.setItem('firstTimeUser',true);
          CONSTANT.isComingFromSignUp = true;
          $state.go('app.editProfile');
      	}else{
      		$scope.hideLoader();
          localStorage.setItem("profile",JSON.stringify(data));
      		$scope.profileInfo = angular.copy($rootScope.profileData);
          $scope.profileImage = 'img/moonSign/'+$scope.profileInfo.moonSign+'.png';
          $scope.getBroadcastQuestion();
      	}
      },function(data){
      	$scope.hideLoader();
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
      	console.log(data);
      });
    }else{
      utility.getMonkProfile()
      .then(function(data){
        localStorage.setItem("email",data.email);
        localStorage.setItem("name",data.name);
        $scope.$emit("updateSideMenuName",data);
        $rootScope.profileData = data;
        if(!data.name || !data.phone || !data.education || !data.residence || !data.experience){
          CONSTANT.isComingFromSignUp = true;
          $state.go('app.editProfile');
        }else{
          $scope.hideLoader();
          localStorage.setItem("profile",JSON.stringify(data));
          $scope.$emit("updateAvaliableStatus");
          $scope.profileInfo = angular.copy($rootScope.profileData);
          $scope.profileImage = 'http://askmonk.in/mImages/'+$scope.profileInfo.email.split('@')[0].toLowerCase()+'.jpg';
          utility.directQuestionsPending()
          .then(function(data1){
            if(data1.length>0){
              $scope.directQuestionData = data1;
              $scope.showDirectQuestionCountPopup();
            }
            console.log(data1)
          },function(data1){
            if(data1 && data1.error.statusCode == 422){
              $scope.showMessage(data.error.message);
            }else{
              $scope.showMessage("Something went wrong. Please try again.");
            }
            // console.log(data1)
          });
        }
      },function(data){
        $scope.hideLoader();
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        console.log(data);
      });
    }
  }

  if(localStorage.firstTimeUser){
    localStorage.removeItem('firstTimeUser');
    $scope.guideScreenImage = [1,2,3,4,5,6,7,8,9];
    $ionicModal.fromTemplateUrl('views/guideScreenModal.html', function (modal) {
      $scope.guideScreenModal = modal;
      $scope.guideScreenModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
  }

  if($scope.loginType == 'user'){
    $scope.showLoader();
    utility.getUserCount()
    .then(function(data){
      $scope.getUserCount = data;
      $scope.hideLoader();
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data);
    });
    if(!localStorage.timelineJson){
      utility.getTimeLineJson()
      .then(function(data){
        localStorage.setItem('timelineJson',JSON.stringify(data));
      },function(data){
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        // console.log(data);
      });
    }
  }else{
    $scope.showLoader();
    utility.getMonkCount()
    .then(function(data){
      $scope.getMonkCount = data;
      $scope.hideLoader();
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data);
    });
  }

  $scope.getBroadcastQuestion = function(){
    utility.getBroadcastQuestions(indexGetQuestion)
    .then(function(data){
      $scope.hideLoader();
      $scope.broadcastQuestions = data;      
      // console.log(data);
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data);
    });
  }

  $scope.color = function (item) {
    if (item.color) {
      return item.color;
    }
    var letters = '012345'.split('');
    var color = '#';
    color += letters[Math.round(Math.random() * 5)];
    letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < 5; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    // assign the color so it doesn't freak out
    item.color = color;
    return color;
  }

  // infinite scroll functon for asked question in monk dashboard.
  $scope.loadMoreQuestion = function(){
    indexGetQuestion = indexGetQuestion+10;
    $scope.showLoader();
    utility.getBroadcastQuestions(indexGetQuestion)
    .then(function(data){
      console.log(data,"broadcast");
      $scope.hideLoader();
      if(data.length==0 && indexGetQuestion>9){
        $scope.noMoreQuestion = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{
        angular.forEach(data,function (value,key) {
          $scope.broadcastQuestions.push(value);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data);
    });
  }
  
  $scope.goToQuestion = function(id){
    $stateParams.id = id;
    $state.go('app.broadcastquestion',$stateParams);
  }

  $scope.showDirectQuestionCountPopup = function(){
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: $scope.directQuestionData.length+' direct questions unanswered.',
      template:'Want to answer now?',
      scope:$scope,
      buttons: [
        {text: 'Ok',type:'button-ios button-clear',
          onTap: function(e) {
            return true;
          }
        },
        {text:'Cancel',type:'button-ios button-clear',
          onTap: function(e) {
            return false;
          }
        }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $state.go('app.directQuestion');
      } else {
        console.log('You are not sure');
      }
    });
  }

  $scope.profileEdit = function(){
    $state.go('app.editProfile');
  }

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
  }

  $scope.closeModal = function(){
    if($scope.guideScreenModal && $scope.guideScreenModal.isShown()){
      $scope.guideScreenModal.remove();
    }
  }
}]);
