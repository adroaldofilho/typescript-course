"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HTTPStatus = require("http-status");
function dbErrorHandler(res, err) {
    console.log("Erro: " + err);
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        code: 'ERRO-001',
        message: 'Erro ao criar usuário'
    });
}
exports.dbErrorHandler = dbErrorHandler;
