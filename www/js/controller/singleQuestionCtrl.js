askmonkApp.controller('singleQuestionCtrl', ['$scope','$state','utility','$timeout','$stateParams','CONSTANT','$ionicModal','$ionicPopup', function($scope, $state, utility,$timeout,$stateParams,CONSTANT,$ionicModal,$ionicPopup){

  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });

  if(localStorage.getItem('questionStatus') == "underObservation"){
    CONSTANT.isComingFromSignUp = true;
    $scope.$emit('writeAnswerActive');
  }

  $scope.loginType = CONSTANT.loginType;
  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
    $scope.transitionAnimation('left',180);
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

  $scope.rateQuestion = function(){
    console.log($scope.question);
    utility.ratingQuestion({"userId":localStorage.getItem('userId'),"email":$scope.question.email,"id":$scope.question.id,"status":$scope.question.status,"rating":$scope.question.rating})
    .then(function(data){
      console.log("success",data);
      $scope.question = angular.copy(data);
    },function(data){
      console.log(data,"error");
    })
  }

  // For Monk
  $scope.writtenAnswer = localStorage.getItem('answer');
  $scope.openWriteModal = function(){
    $ionicModal.fromTemplateUrl('views/writeAnswerModal.html', function (modal) {
      $scope.writeAnswerModal = modal;
      $scope.writeAnswerModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up',
      hardwareBackButtonClose: true
    });
  }
  
  $scope.userDetail = function(){
    $ionicModal.fromTemplateUrl('views/userDetailModal.html', function (modal) {
      $scope.userDetailModal = modal;
      $scope.userDetailModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  }

  $scope.acceptQuestion = function(){
    $scope.showLoader();
    utility.acceptQuestionMonk({"userId":$scope.question.userId,"email":$scope.question.email,"id":$scope.question.id,"monkId":localStorage.getItem('userId'),"monkEmail":localStorage.getItem('email'),"status": "asked"})
    .then(function(data){
      CONSTANT.isComingFromSignUp = true;
      $scope.$emit("writeAnswerActive");
      $scope.question = angular.copy(data);
      localStorage.setItem('questionStatus',$scope.question.status);
      localStorage.setItem('questionId',$scope.question.id);
      $scope.hideLoader();
      $timeout(function(){
        $scope.openWriteModal();
      }, 100);
      console.log(data,"success");
    },function(data){
      console.log(data,"error");
    })
  }

  $scope.askBeforeAccept = function(){
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: 'After accepting a question answering it is mandatory.',
      template:'Do u want to proceed ?',
      buttons: [
        {text: 'Yes',type:'button-ios button-clear',
          onTap: function(e) {
            return true;
          }
        },
        {text:'No',type:'button-ios button-clear',
          onTap: function(e) {
            return false;
          }
        }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        $scope.acceptQuestion();
      } else {
        console.log('You are not sure');
      }
    });
  }

  $scope.closeAnswerPopup = function(){
    $scope.writtenAnswer = localStorage.getItem('answer');
    if ($scope.writeAnswerModal && $scope.writeAnswerModal.isShown()) {
      $scope.writeAnswerModal.remove();
    }
  }
  $scope.postAnswer = function(){
    if(localStorage.getItem('answer') != ""){
      $scope.question.answer = localStorage.getItem('answer');
      var confirmPopup = $ionicPopup.show({
        cssClass:"ios",
        title: 'Going further would send the answer to the user.',
        template:'Do u wish to continue ?',
        buttons: [
          {text: 'Yes',type:'button-ios button-clear',
            onTap: function(e) {
              return true;
            }
          },
          {text:'No',type:'button-ios button-clear',
            onTap: function(e) {
              return false;
            }
          }
        ]
      });
      confirmPopup.then(function(res) {
        if(res) {
          $scope.showLoader();
          console.log('You are sure');
          utility.submitAnswer($scope.question)
          .then(function(data){
            // console.log(data);
            $scope.hideLoader();
            CONSTANT.isComingFromSignUp = false;
            $scope.$emit("writeAnswerActive");
            $scope.writtenAnswer = '';
            localStorage.removeItem('answer');
            localStorage.removeItem('questionStatus');
            localStorage.removeItem('questionId');
            $scope.question = angular.copy(data);
          },function(data){
            $scope.hideLoader();
            console.log(data);
          });
        } else {
          console.log('You are not sure');
        }
      });
    }
  }


  $scope.closeModal = function(){
    if($scope.userDetailModal && $scope.userDetailModal.isShown()){
      $scope.userDetailModal.remove();
    }
    if($scope.writeAnswerModal && $scope.writeAnswerModal.isShown()){
      $scope.writeAnswerModal.remove();
    }
  }
  
}]);

askmonkApp.controller('writeAnswerModalPopupCtrl', ['$scope','$timeout', function($scope,$timeout){
  $scope.writeAnswerTextarea = {'answer':""};
  if(localStorage.getItem('answer')){
    $scope.writeAnswerTextarea.answer = localStorage.getItem('answer');
  }
  $scope.closeWriteAnswerPopup = function(){
    $timeout(function(){
      $scope.closeAnswerPopup();
    }, 250);
    cordova.plugins.Keyboard.close();
  }
  $scope.expandText = function(){
    localStorage.setItem('answer',$scope.writeAnswerTextarea.answer);
    var element = document.getElementById("writeAnswerTextarea");
    element.style.height =  element.scrollHeight + "px";
  }
}]);

askmonkApp.controller('userDetailModalPopupCtrl', ['$scope','utility','getMoonSign', function($scope,utility,getMoonSign){
    $scope.profileInfo = angular.copy(getMoonSign($scope.question));
    $scope.profileImage = 'img/moonSign/'+$scope.profileInfo.moonSign+'.png';
}]);