'use strict';
askmonkApp.service('utility', ['$q','$http','$state', function utility($q, $http, $state) {
  var service = {
    'authenticated': null,
    request: function(args) {
      // Let's retrieve the token from the cookie, if available
      if(localStorage.getItem('token')){
        $http.defaults.headers.common.Authorization = 'Basic ' + localStorage.getItem('token');
      }

      params = args.params || {}
      args = args || {};
      var deferred = $q.defer(),
        url = this.API_URL + args.url,
        method = args.method || "GET",
        params = params,
        data = args.data || {};

      $http({
        url: url,
        withCredentials: this.use_session,
        method: method.toUpperCase(),
        params: params,
        data: data,
        timeout:90000
      })
      .success(angular.bind(this,function(data, status, headers, config) {
        deferred.resolve(data, status);
      }))
      .error(angular.bind(this,function(data, status, headers, config) {
        deferred.reject(data, status);
      }));
      return deferred.promise;
    },
    register: function(args){
      return this.request({
        'method': "POST",
        'url': "/api/users/",
        'data': args
      });
    },
    login: function(args){
      return this.request({
       'method': "POST",
       'url': "/api/users/login/",
       'data':args
      }).then(function(data){
        if(!utility.use_session){
          $http.defaults.headers.common.Authorization = 'Basic ' + data.id;
          localStorage.setItem('token',data.id);
          localStorage.setItem('userId',data.userId);
        }
      });
    },
    googleOauth:function(args){
      return this.request({
       'method': "POST",
       'url': "/googleOAuthLogin/",
       'params':args
      });
    },
    logout:function(){
      return this.request({
        'method':"POST",
        'url':"/api/users/logout",
        'params': {"access_token":localStorage.getItem('token')},
      });
    },
    changeUserPassword:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/users/changePassword/",
        'data':args,
        'params': {"access_token":localStorage.getItem('token'),"email":localStorage.getItem('email')}
      });
    },
    forgetUserPassword:function(args){
      return this.request({
        'method':"POST",
        'url':"/request-password-reset/user/"+args
      });
    },
    resendValidationUser:function(args) {
      return this.request({
        'method':"POST",
        'url':"/resendValidationEmail/"+args
      });
    },
    getAllQuestion: function(){
      return this.request({
        'method': "GET",
        'url': '/api/questions/tagQuestions'
      });
    },
    getUserQuestions:function(){
      return this.request({
        'method': "GET",
        'url': "/api/questions/getQuestions/"+localStorage.getItem('userId')
      });
    },
    getSingleQuestions:function(id){
      return this.request({
        'method':"GET",
        'url':"/api/questions/"+id
      });
    },
    getUserProfile: function(args){
      return this.request({
        'method':"GET",
        'url':'/api/users/findUser/'+args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    updateUserProfile:function(args){
      return this.request({
        'method':"PUT",
        'url':"/api/users/"+localStorage.getItem('userId'),
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    askQuestion:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/questions/askQuestion",
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    editQuestion:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/questions/editQuestion",
        'data':args
      });
    },
    askDirectQuestion:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/questions/askDirect",
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    getPacks:function(){
      return this.request({
        'method':"GET",
        'url':"/api/payments/packs"
      });
    },
    getAllMonks:function(){
      return this.request({
        'method':"GET",
        'url':"/api/monks"
      })
    },
    getAllMonksCount:function(){
      return this.request({
        'method':"GET",
        'url':"/api/monks/getCountsForAllMonks"
      });
    },
    getSingleMonk:function(id){
      return this.request({
        'method':"GET",
        'url':"/api/monks/getMonkDetails/"+id
      });
    },
    ratingQuestion:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/users/rateAnswerByUser",
        'data':args
      });
    },
    getUserCount:function(){
      return this.request({
        'method':"GET",
        'url':"/api/users/getCounts/"+localStorage.getItem('userId'),
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    getTimeLineJson: function(){
      return this.request({
        'method':"GET",
        'url':"/api/questions/timeLineJson"
      });
    },
    getHoroscope:function(id){
      return this.request({
        'method':"GET",
        'url':"/dailyHoroscope/"+id
      });
    },
    userPaymentInfo:function(){
      return this.request({
        'method':"GET",
        'url':"/api/payments/findPayments/"+localStorage.getItem('userId')
      });
    },
    getbroadcastArticle:function(nextIndex){
      return this.request({
        'method':"GET",
        'url':"/api/articles/broadcastArticles/"+nextIndex
      });
    },
    getSingleBroadcastArticle:function(id){
      return this.request({
        'method':"GET",
        'url':"/api/articles/"+id
      });
    },
    getFullPackages:function(){
      return this.request({
        'method':"GET",
        'url':"/api/questions/fullPackages"
      });
    },
    postQuestionPackages:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/questions/askFullAnalysis",
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },

    notification:function(args){
      return this.request({
        "method":"POST",
        'url':"/api/notifications/registerDevice",
        'data':args
      });
    },


    //monks Data
    updateMonkAvailableStatus:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/monks/availableStatus",
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    monkLogin:function(args){
      return this.request({
       'method': "POST",
       'url': "/api/monks/login/",
       'data':args
      }).then(function(data){
        if(!utility.use_session){
          $http.defaults.headers.common.Authorization = 'Basic ' + data.id;
          localStorage.setItem('token',data.id);
          localStorage.setItem('userId',data.userId);
       }
      });
    },
    forgetMonkPassword:function(args){
      return this.request({
        'method':"POST",
        'url':"/request-password-reset/monk/"+args
      });
    },
    getMonkProfile:function(){
      return this.request({
        'method':"GET",
        'url':'/api/monks/findMonk/'+localStorage.getItem('userId')
      });
    },
    updateMonkProfile:function(args){
      return this.request({
        'method':"PUT",
        'url':"/api/monks/"+localStorage.getItem('userId'),
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    getQuestionOnStatus:function(args,nextIndex){
      return this.request({
        'method':"GET",
        'url':"/api/questions/getStatusQuestions/"+args+'/'+nextIndex
        // 'params': {"access_token":localStorage.getItem('token')}
      });
    },
    getMonkAnsweredQuestion:function(nextIndex){
      return this.request({
        'method':"GET",
        'url':"/api/questions/findMonkQuestions/"+localStorage.getItem('userId')+'/'+nextIndex
      });
    },
    acceptQuestionMonk:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/questions/acceptQuestion/",
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      })
    },
    submitAnswer:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/monks/answerQuestion/",
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    getDirectQuestion:function(nextIndex){
      return this.request({
        'method':"GET",
        'url':"/api/questions/directQuestions/"+localStorage.getItem('userId')+'/'+nextIndex
      })
    },
    changeMonkPassword:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/monks/changeMonkPassword/",
        'data':args,
        'params': {"access_token":localStorage.getItem('token'),"email":localStorage.getItem('email')}
      });
    },
    addMoney:function(args){
      return this.request({
        'method':"POST",
        'url':"/api/payments/addMoney/",
        'data':args,
        'params':{"access_token":localStorage.getItem('token')}
      });
    },
    getMonkCount:function(){
      return this.request({
        'method':"GET",
        'url':"/api/monks/getCounts/"+localStorage.getItem('userId'),
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    directQuestionsPending:function(){
      return this.request({
        'method':"GET",
        'url':"/api/monks/directQuestionsPending/"+localStorage.getItem('userId')
      });
    },
    getDirectQuestionCount:function(){
      return this.request({
        'method':"GET",
        'url':"/api/questions/count?where[status]=direct&where[monkId]="+localStorage.getItem('userId')
      });
    },
    monkPaymentInfo:function(){
      return this.request({
        'method':"GET",
        'url':"/api/monkPayments/findPayments/"+localStorage.getItem('userId')
      });
    },
    monkDraftQuestion:function(){
      return this.request({
        'method':"GET",
        'url':"/api/questions?filter[where][status]=underObservation&[where][monkId]="+localStorage.getItem('userId')
      });
    },
    initialize: function(url, sessions, scope, rootScope){
      this.API_URL = url;
      this.use_session = sessions;
      if(scope){
        scope.authenticated = null;
        if(this.authenticated == null){
          if(localStorage.getItem('token')){
            utility.authenticated = true;
            scope.authenticated = true;
            rootScope.token = localStorage.getItem('token');
          }
          else{
            utility.authenticated = false;
            scope.authenticated = false;
          }
        }else{
          scope.authenticated = this.authenticated;
        }
        scope.setAuth = function(auth){
          scope.authenticated = auth;
        }
      }
    }
  }
  return service;
}]);