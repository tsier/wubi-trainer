(function () {
    "use strict";
    angular.module('practiceViewControllers', ['tutorServices', 'LocalStorageModule', 'DataServicesModule', 'feedbackModule' ,'keyboard'])
        .controller("FeedbackController", ['$scope', 'feedbackService', 'feedbackChannel', '$log', '$timeout','keyboardStatus', function ($scope, feedbackService, feedbackChannel, $log, $timeout, keyboardStatus) {
            // control the feedback and UI Interface

            // display keyboard hint
            $scope.keyboard = {
                isFocused: false
            };

            $scope.show = function (message) {
                //$scope.hideLastAnswerWrong();
                //$scope.hideLastAnswerCorrect();
                if (message === 'CORRECT') {

                    $scope.showLastAnswerCorrect();
                    $timeout(function () {
                        $scope.hideLastAnswerCorrect();
                    }, 400);
                }
                else if (message === 'WRONG') {
                    $scope.showLastAnswerWrong();
                    $timeout(function () {
                        $scope.hideLastAnswerWrong();
                    }, 800);

                }
            };

            feedbackChannel.subscribeAnswerGiven($scope, $scope.show);


            $scope.$watch('keyboard.isFocused', function (nv, ov) {
                if (nv !== ov) {
                }
            });

          $scope.$watch('keyboardStatus.focused', function (nv, ov) {
            // debugger;
            if (nv !== ov) {
              debugger
            }
          });
            $scope.display = {};

            $scope.$watch(function () {
                return feedbackService.showAnswer;
            }, function (nv, ov) {
                $scope.display.showCorrectAnswer = nv;
            });
            $scope.$watch(function () {
                return feedbackService.showKeyBoard;
            }, function (nv, ov) {
                $scope.display.showKeyBoard = nv;

            });

            $scope.hint = {showCorrectAnswer: false};


            $scope.display.showAnswerByService = feedbackService.showAnswer;

            /// from hanzi
            $scope.display = {};
            $scope.display = {showKeyBoard: false};


            this.toggleKeyBoard = function () {
                $scope.display.showKeyBoard = !$scope.display.showKeyBoard;

            };
            this.toggleGroupHint = function () {
                $scope.display.showGroup = !$scope.display.showGroup;
            };

            $scope.showLastAnswerCorrect = function () {
                $scope.display.lastAnswerCorrect = true;
            };

            $scope.hideLastAnswerCorrect = function () {

                $scope.display.lastAnswerCorrect = false;
            };


            $scope.showLastAnswerWrong = function () {
                $scope.display.lastAnswerWrong = true;

            };
            $scope.hideLastAnswerWrong = function () {
                $scope.display.lastAnswerWrong = false;

            };


            this.markWrong = function () {

            };


            $scope.display.display = 1;


        }])


        .controller('PromptController', ['$scope', 'runner', '$log', '$timeout', 'CHARACTER_GROUPS', 'Hanzi', 'tutor','keyboardStatus', function ($scope, runner, $log, $timeout, CHARACTER_GROUPS, Hanzi, tutor, keyboardStatus) {
            // reflect the data changes in the model
            //--------------- set group symbol on scope : content of sidebar via scope inheritance
            $scope.setCharacterGroupSymbol = function (groupName) {
                $scope.data.characterGroupSymbol = CHARACTER_GROUPS[groupName];
            };
            //-------------------
            $scope.signalDanger = function () {
                $scope.data.showWarning = true;

                $scope.data.warningTimeout = $timeout(function () {
                    $scope.data.showWarning = false;
                }, 2000);
            };

            $scope.cancelWarning = function () {
                if ($scope.data.warningTimeout) {

                    $timeout.cancel($scope.data.warningTimeout);
                }
                $scope.data.showWarning = false;
            };
            $scope.isHanzi = function (obj) {
                return obj instanceof Hanzi;
            };
            $scope.input = {inputSequence: tutor.inputSequence};

            $scope.$watch(function () {
                return tutor.inputSequence
            }, function (nv, ov) {
                if (nv!==ov){

                $scope.input = {inputSequence: tutor.inputSequence};
                }

            });

            //---------------init
            $scope.data = {};
            runner.start();
            $scope.data.promptCharacter = runner.getCurrent();
            $scope.data.percent = runner.getProgressPercent();

            if ($scope.data.promptCharacter) {
                $scope.setCharacterGroupSymbol($scope.data.promptCharacter.group);
            }

            if (!$scope.data.promptCharacter) {
                $scope.showAlert();
            }

            $scope.$watch(angular.bind(runner, runner.getCurrent), function (nv, ov) {
                if (nv !== ov) {
                    //$log.log('new prompt character:', $scope.data.promptCharacter.key, $scope.data.promptCharacter);
                    if (angular.isDefined($scope.data.promptCharacter)) {

                        $scope.cancelWarning();
                        $scope.data.promptCharacter = nv;

                        $scope.setCharacterGroupSymbol($scope.data.promptCharacter.group);
                        //console.log(runner.learningQueue);

                        if ($scope.data.promptCharacter.status === 'better') {
                            $scope.signalDanger();
                        }
                        $scope.data.percent = runner.getProgressPercent();
                    }
                }
            });


        }])

        .controller('RightSideNavController', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
            $scope.close = function () {
                $mdSidenav('right').toggle();
            };
        }])

        .controller('KeyBoardInput', ['$scope',  'keyboardStatus', function ($scope, keyboardStatus) {

            //$scope.keyboard.isFocused = false;

            $scope.keyboardStatus = keyboardStatus;
            $scope.startFocusInput = function () {
              console.log('kb i starting', keyboardStatus);
                keyboardStatus.listen = true;
                keyboardStatus.focused = true;

                $scope.keyboard.isFocused = true;


            };

          $scope.$watch('keyboardStatus.listen', function (nv, ov) {
            console.log("kb i listen from watch", nv, ov);
            if (nv !== ov) {
              console.log("listen from watch", nv);
            }
          });
          $scope.$watch('keyboardStatus.focused', function (nv, ov) {
            console.log("kb i focused from watch", nv, ov);
            if (nv !== ov) {
              console.log("focused from watch", nv);
            }
          });

            $scope.stop = function () {
                alert('stop');

            };
            $scope.stopFocusInput = function () {
              console.log('stopping', keyboardStatus);
              keyboardStatus.listen = false;

                $scope.keyboard.isFocused = false;
            };
            $scope.startFocusInput();     // space cal

        }])

        .controller('PracticeViewController', ['$scope', '$mdSidenav', '$mdDialog', '$location', '$log', function ($scope, $mdSidenav, $mdDialog, $location, $log) {
            var SETUP_VIEW_PATH = '/setup';
            $scope.debugSettings = {
                showKeystrokes: false,
                showReset: true

            };

            $scope.toggleRight = function () {
                $mdSidenav('right').toggle();
            };

            $scope.showAlert = function (ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('You have no characters selected')
                        .content('Click "Ok" to switch to the lesson view to choose a set.')
                        .ariaLabel('Password notification')
                        .ok('OK!')
                        .targetEvent(ev)
                ).then(function (answer) {
                        $location.path(SETUP_VIEW_PATH);
                    }, function () {

                    });
            };


        }]);

}() );