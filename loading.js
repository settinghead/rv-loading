"use strict";

angular.module("risevision.common.loading", ["angularSpinner"])
  .service("$loading", ["$q", "$rootScope", function ($q, $rootScope) {
    var self = this;
    this.start = function(spinnerKeys) {
      spinnerKeys = $.isArray(spinnerKeys) ? spinnerKeys : [spinnerKeys];
      for (var i = 0; i < spinnerKeys.length; i++) {
        $rootScope.$broadcast("rv-spinner:start", spinnerKeys[i]);
      }
    };

    this.stop = function(spinnerKeys) {
      spinnerKeys = $.isArray(spinnerKeys) ? spinnerKeys : [spinnerKeys];
      for (var i = 0; i < spinnerKeys.length; i++) {
        $rootScope.$broadcast("rv-spinner:stop", spinnerKeys[i]);
      }
    };

    this.stopSpinnerAfterPromise = function(spinnerKeys, promises) {

      spinnerKeys = $.isArray(spinnerKeys) ? spinnerKeys : [spinnerKeys];

      var stop = function() {
        for (var i = 0; i < spinnerKeys.length; i++) {
          $rootScope.$broadcast("rv-spinner:stop", spinnerKeys[i]);
        }
      };
  
      var promise = $.isArray(promises) ? $q.all(promises) : promises;
      promise.then(function() { stop(); }, function() { stop(); });
    };
   
    this.getDefaultSpinnerOptions = function() {
      return self.defaultSpinnerOptions;
    };

    this.defaultSpinnerOptions = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: "#555", // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: "spinner", // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: "50%", // Top position relative to parent in px
        left: "50%" // Left position relative to parent in px
    };
  }])
  .directive("rvSpinner", ["usSpinnerService", "$loading", "$compile", function (usSpinnerService, $loading, $compile) {
    return {
      scope: {
        backdropClass: "@rvSpinnerBackdropClass",
        rvSpinnerKey: "@rvSpinnerKey",
        rvSpinnerStartActive: "=?rvSpinnerStartActive",
        rvSpinnerOptions: "=rvSpinner"
      },
      link: function postLink(scope, $element, iAttrs) {
        scope.active = angular.isDefined(iAttrs.rvSpinnerStartActive) && iAttrs.rvSpinnerStartActive === "1";
        var tpl = "<div ng-show=\"active\" class=\"spinner-backdrop fade {{backdropClass}}\"" + 
          " ng-class=\"{in: active}\" us-spinner=\"rvSpinnerOptions\"" + 
          " spinner-key=\"{{rvSpinnerKey}}\"";
        
        if (iAttrs.rvSpinnerStartActive && iAttrs.rvSpinnerStartActive === "1") {
          tpl += " spinner-start-active=\"1\"></div>";
        }
        else {
          tpl += "></div>";
        }

        $element.prepend($compile(tpl)(scope));

        scope.$on("rv-spinner:start", function (event, key) {
          if(key === scope.rvSpinnerKey){
            usSpinnerService.spin(key);
            scope.active = true;
          }
        });

        scope.$on("rv-spinner:stop", function (event, key) {
          if(key === scope.rvSpinnerKey){
            usSpinnerService.stop(key);
            scope.active = false;
          }
        });
      }
    };
  }])
;