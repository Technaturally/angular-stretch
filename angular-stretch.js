angular.module('angular-stretch', [])
.directive('ngStretch', ['$window', '$timeout', function($window, $timeout){
	return {
		restrict: 'EA',
		link: function(scope, element, attr){
			var windowElement = angular.element($window);

			windowElement.on('resize', checkSize);
			element.ready(checkSize);
			$timeout(checkSize);

			function checkSize(){
				var elemBounds = element[0].getBoundingClientRect();
				var windowHeight = windowElement[0].innerHeight;
				var heightDiff = windowHeight - elemBounds.bottom;
				if(heightDiff){
					element.css('height', (element[0].clientHeight + heightDiff)+'px');
				}
			}
		}
	};
}]);