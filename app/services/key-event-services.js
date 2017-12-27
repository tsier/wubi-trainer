(function () {
    "use strict";
    angular.module('services', ['tutorServices', 'wubiConstants', 'feedbackModule', 'RunnerModule', 'keyboard']).

        factory('keyEventHandler', ['tutor', 'KEYS', 'feedbackService', 'runner', '$mdSidenav', 'keyboardStatus', function (tutor, KEYS, feedbackService, runner, $mdSidenav, keyboardStatus) {
            return {
                handle: function (keyNumber) {

                    var notCheckedKeys = [KEYS.ENTER, KEYS.ESCAPE, KEYS.SPACE, KEYS.z];

                    if ((notCheckedKeys.indexOf(keyNumber) === -1)) {
                      if ($mdSidenav('right').isOpen()){
                        $mdSidenav('right').toggle();
                        keyboardStatus.listen = true;
                        keyboardStatus.focused= true;


                      }

                        tutor.check(keyNumber);
                        if (tutor.promptNext) {
                            // tutor could check answer was correct

                            runner.prompt();
                        }


                    }
                    if (keyNumber === KEYS.z){
                      if (!$mdSidenav('right').isOpen()){
                        $mdSidenav('right').toggle();
                        // keyboardStatus.focused = false;
                        // keyboardStatus.listen = true;

                      }
                      tutor.markWrong();
                    }
                    if (keyNumber === KEYS.SPACE) {
                        $mdSidenav('right').toggle();
                        keyboardStatus.focused = true;

                    }
                    if (keyNumber === KEYS.ENTER) {
                        feedbackService.toggleKeyboardVisibilty();
                    }


                }
            };
        }

        ]);
}());