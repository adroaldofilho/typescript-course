"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var service_1 = require("../User/service");
var handlers_1 = require("../../api/responses/handlers");
var config = require('../../config/env/config')();
var TokenRoutes = /** @class */ (function () {
    function TokenRoutes() {
    }
    TokenRoutes.prototype.auth = function (req, res) {
        console.log('auth-modules PASSEI AQUI: ', req.body);
        var credentials = {
            email: req.body.email,
            password: req.body.password
        };
        console.log('email: ', credentials.email);
        if (credentials.hasOwnProperty('email') && credentials.hasOwnProperty('password')) {
            service_1.default
                .getByEmail(credentials.email)
                .then(_.partial(handlers_1.default.authSuccess, res, credentials))
                .catch(_.partial(handlers_1.default.authFail, req, res));
        }
    };
    return TokenRoutes;
}());
exports.default = new TokenRoutes();
