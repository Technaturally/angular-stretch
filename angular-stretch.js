angular.module('angular-stretch', [])
.directive('ngStretch', ['$window', '$timeout', function($window, $timeout){
	return {
		restrict: 'EA',
		link: function(scope, element, attr){
			var windowElement = angular.element($window);
			var bottomElement, topElement;

			var origCss = {
				top: element.css('top'),
				height: element.css('height')
			};
			var enabled;

			attr.$observe('ngStretch', setBottom);
			attr.$observe('ngStretchTop', setTop);
			attr.$observe('ngStretchEnabled', setEnabled);
			setEnabled(attr['ngStretchEnabled']);

			element.on('$destroy', function(){
				setEnabled(false);
			});

			function resetCSS(){
				for(var prop in origCss){
					element.css(prop, origCss[prop]);
				}
			}

			function setEnabled(stretchEnabled){
				if(angular.isDefined(stretchEnabled)){
					if(stretchEnabled !== true && stretchEnabled !== false){
						stretchEnabled = scope.$eval(stretchEnabled);
					}
				}
				else{
					stretchEnabled = true;
				}
				if(enabled != stretchEnabled){
					enabled = stretchEnabled;
					if(!enabled){
						windowElement.off('resize', checkSize);
						windowElement.off('scroll', checkSize);
						resetCSS();
					}
					else{
						windowElement.on('resize', checkSize);
						windowElement.on('scroll', checkSize);
						element.ready(checkSize);
						$timeout(checkSize);
					}
				}
			}

			function setBottom(id){
				if(id){
					var getBottom = document.getElementById(id);
					if(getBottom){
						bottomElement = angular.element(getBottom);
					}
				}
				else{
					bottomElement = undefined;
				}
			}
			function setTop(id){
				if(id){
					var getTop = document.getElementById(id);
					if(getTop){
						topElement = angular.element(getTop);
					}
				}
				else{
					topElement = undefined;
				}
			}

			function isFixed(check){
				var style = $window.getComputedStyle( check.length ? check[0] : check );
				return (style && style.position == 'fixed');
			}

			function checkSize(){
				if(!enabled){
					return;
				}
				var elemBounds = element[0].getBoundingClientRect();

				if(topElement){
					var topElemBounds = topElement[0].getBoundingClientRect();
					if(topElemBounds.bottom < 0 && isFixed(element)){
						element.css('top', '0px');
						elemBounds = element[0].getBoundingClientRect();
					}
					else{
						var topDiff = topElemBounds.bottom - elemBounds.top;
						if(topDiff){
							element.css('top', (element[0].offsetTop + topDiff)+'px');
							elemBounds = element[0].getBoundingClientRect();
						}
					}
				}

				var windowHeight = windowElement[0].innerHeight;
				var heightDiff = windowHeight - elemBounds.bottom;

				if(bottomElement){
					var bottomElemBounds = bottomElement[0].getBoundingClientRect();
					if(bottomElemBounds.top < windowHeight){
						heightDiff = bottomElemBounds.top - elemBounds.bottom;
					}
				}
				
				if(heightDiff){
					element.css('height', (element[0].clientHeight + heightDiff)+'px');
				}
			}
		}
	};
}]);