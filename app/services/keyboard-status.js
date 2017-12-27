angular.module('keyboard', [])
    .factory('keyboardStatus', [ function () {
        var service = {
            listen: true,
            focused: false,
        };

        return service;
    }]);
