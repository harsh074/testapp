askmonkApp.directive('focusMe', ['$timeout','$ionicScrollDelegate', function($timeout,$ionicScrollDelegate) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        element[0].focus();
        $timeout(function(){
          $ionicScrollDelegate.$getByHandle('scrollHandle').resize();
          $ionicScrollDelegate.$getByHandle('scrollHandle').scrollBottom(true);
        }, 200);
      },100);
    }
  };
}]);

askmonkApp.directive('writeAnswer', ['$timeout', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        element[0].focus();
      },420);
    }
  };
}]);

askmonkApp.filter("timeago", function () {
  return function (time, local, raw) {
    if (!time) return "never";
    if (!local) {
      (local = Date.now())
    }
    if (angular.isDate(time)) {
      time = time.getTime();
    } else if (typeof time === "string") {
      time = new Date(time).getTime();
    }
    if (angular.isDate(local)) {
      local = local.getTime();
    }else if (typeof local === "string") {
      local = new Date(local).getTime();
    }
    if (typeof time !== 'number' || typeof local !== 'number') {
      return;
    }
    var
      offset = Math.abs((local - time) / 1000),
      span = [],
      MINUTE = 60,
      HOUR = 3600,
      DAY = 86400,
      WEEK = 604800,
      MONTH = 2629744,
      YEAR = 31556926,
      DECADE = 315569260;

    if (offset <= MINUTE)              span = [ '', raw ? 'now' : 'a minute' ];
    else if (offset < (MINUTE * 60))   span = [ Math.round(Math.abs(offset / MINUTE)), 'min' ];
    else if (offset < (HOUR * 24))     span = [ Math.round(Math.abs(offset / HOUR)), 'hr' ];
    else if (offset < (DAY * 7))       span = [ Math.round(Math.abs(offset / DAY)), 'day' ];
    else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
    else if (offset < (YEAR * 10))     span = [ Math.round(Math.abs(offset / YEAR)), 'year' ];
    else if (offset < (DECADE * 100))  span = [ Math.round(Math.abs(offset / DECADE)), 'decade' ];
    else                               span = [ '', 'a long time' ];
    span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
    span = span.join(' ');
    if (raw === true) {
      return span;
    }
    return (time <= local) ? span + ' ago' : 'in ' + span;
  }
});


askmonkApp.directive('nxEqual', function() {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, model) {
      if (!attrs.nxEqual) {
        console.error('nxEqual expects a model as an argument!');
        return;
      }
      scope.$watch(attrs.nxEqual, function (value) {
        model.$setValidity('nxEqual', value === model.$viewValue);
      });
      model.$parsers.push(function (value) {
        var isValid = value === scope.$eval(attrs.nxEqual);
        model.$setValidity('nxEqual', isValid);
        return isValid ? value : undefined;
      });
    }
  };
});

askmonkApp.directive('embedSrc', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var current = element;
      scope.$watch(function() {
        return attrs.embedSrc;
      }, function() {
        var clone = element.clone().attr('src', attrs.embedSrc);
        current.replaceWith(clone);
        current = clone;
      });
    }
  };
});

askmonkApp.directive('lazyScroll', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  return {
    restrict: 'A', 
    link: function($scope, $element) {
      var scrollTimeoutId = 0;
      $scope.invoke = function() { 
        $rootScope.$broadcast('lazyScrollEvent'); 
      };
      $element.bind('scroll', function() {
        $timeout.cancel(scrollTimeoutId);
        scrollTimeoutId = $timeout($scope.invoke, 0); 
      });
    }
  }
}]);

askmonkApp.directive('imageLazySrc', ['$document', '$timeout', '$ionicScrollDelegate', '$compile', function($document, $timeout, $ionicScrollDelegate, $compile) {
  return {
    restrict: 'A',
    scope: { 
      lazyScrollResize: "@lazyScrollResize", 
      imageLazyBackgroundImage: "@imageLazyBackgroundImage"
    },
    link: function($scope, $element, $attributes) {
      if (!$attributes.imageLazyDistanceFromBottomToLoad) { $attributes.imageLazyDistanceFromBottomToLoad = 0; }
      if (!$attributes.imageLazyDistanceFromRightToLoad) { $attributes.imageLazyDistanceFromRightToLoad = 0; }
      if ($attributes.imageLazyLoader) {
        var loader = $compile('<div class="image-loader-container"><ion-spinner class="image-loader" icon="' + $attributes.imageLazyLoader + '"></ion-spinner></div>')($scope);
        $element.after(loader); 
      }
      var deregistration = $scope.$on('lazyScrollEvent', function() {
        if (isInView()){ 
          loadImage();
          deregistration(); 
        } 
      });
      
      function loadImage() {
        $element.bind("load", function(e) {
          if ($attributes.imageLazyLoader) { loader.remove(); }
          if ($scope.lazyScrollResize == "true") { $ionicScrollDelegate.resize(); }
        });
        if ($scope.imageLazyBackgroundImage == "true") {
          var bgImg = new Image();
          bgImg.onload = function() {
            if ($attributes.imageLazyLoader) { loader.remove(); }
              $element[0].style.backgroundImage = 'url(' + $attributes.imageLazySrc + ')';
            if ($scope.lazyScrollResize == "true") { $ionicScrollDelegate.resize(); }
          };
          bgImg.src = $attributes.imageLazySrc;
        }else{ 
          $element[0].src = $attributes.imageLazySrc;
        }
      }

      function isInView() {
        var clientHeight = $document[0].documentElement.clientHeight;
        var clientWidth = $document[0].documentElement.clientWidth;
        var imageRect = $element[0].getBoundingClientRect();
        return (imageRect.top >= 0 && imageRect.top <= clientHeight + parseInt($attributes.imageLazyDistanceFromBottomToLoad)) && (imageRect.left >= 0 && imageRect.left <= clientWidth + parseInt($attributes.imageLazyDistanceFromRightToLoad));
      }
      $element.on('$destroy', function() { deregistration(); });
        $timeout(function() {
          if (isInView()) { loadImage();
            deregistration(); 
          } 
        }, 500);
      }
    };
}]);
