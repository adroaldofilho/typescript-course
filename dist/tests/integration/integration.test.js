"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./config/helpers");
var HTTPStatus = require("http-status");
var jwt = require("jwt-simple");
describe('Testes de Integração', function () {
    'use strict';
    var config = require('../../server/config/env/config')();
    var model = require('../../server/models');
    var id;
    var token;
    var tokenRecebido;
    var userTest = {
        id: 100,
        name: 'Usuário Teste',
        email: 'teste@gmail.com',
        password: 'teste'
    };
    var userDefault = {
        id: 1,
        name: 'Adroaldo',
        email: 'adroaldoaragao@gmail.com',
        password: '123'
    };
    beforeEach(function (done) {
        model.User.destroy({
            where: {}
        })
            .then(function () {
            return model.User.create(userDefault);
        })
            .then(function () {
            return model.User.create(userTest)
                .then(function () {
                token = jwt.encode({ id: userDefault.id }, config.secret);
                done();
            });
        });
    });
    describe('POST /token', function () {
        it('Deve receber um JWT token', function (done) {
            var credentials = {
                email: userDefault.email,
                password: userDefault.password
            };
            helpers_1.request(helpers_1.app)
                .post('/token')
                .send(credentials)
                .end(function (error, res) {
                tokenRecebido = res.body.token;
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.token).to.equal("" + token);
                done(error);
            });
        });
        it('Não deve gerar token', function (done) {
            var credentials = {
                email: 'qualquer@qualquer.com',
                password: 'qualquer'
            };
            helpers_1.request(helpers_1.app)
                .post('/token')
                .send(credentials)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.UNAUTHORIZED);
                helpers_1.expect(res.body).to.empty;
                done(error);
            });
        });
    });
    describe('GET /api/users/all', function () {
        it('Deve retornar um ARRAY com todos os usuários', function (done) {
            console.log('token gerado: ', token);
            console.log('token recebido: ', tokenRecebido);
            helpers_1.request(helpers_1.app)
                .get('/api/users/all')
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .end(function (error, res) {
                console.log(res.status, token);
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.payload).to.be.an('array');
                helpers_1.expect(res.body.payload[0].name).to.be.equal(userDefault.name);
                helpers_1.expect(res.body.payload[0].email).to.be.equal(userDefault.email);
                done(error);
            });
        });
    });
    describe('GET /api/users/:id', function () {
        it('Deve retornar um usuário', function (done) {
            helpers_1.request(helpers_1.app)
                .get("/api/users/" + userTest.id)
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.payload.name).to.equal(userTest.name);
                helpers_1.expect(res.body.payload).to.have.all.keys([
                    'email', 'id', 'name', 'password'
                ]);
                id = res.body.payload.id;
                done(error);
            });
        });
    });
    describe('POST /api/users/create', function () {
        it('Deve criar um novo usuário', function (done) {
            var user = {
                id: 2,
                name: 'Usuário 2 para Teste',
                email: 'teste2@gmail.com',
                password: 'teste2'
            };
            helpers_1.request(helpers_1.app)
                .post('/api/users/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .send(user)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.payload.id).to.eql(user.id);
                helpers_1.expect(res.body.payload.name).to.eql(user.name);
                helpers_1.expect(res.body.payload.email).to.eql(user.email);
                done(error);
            });
        });
    });
    describe('PUT /api/users/:id/update', function () {
        it('Deve atualizar um usuário', function (done) {
            var user = {
                name: 'TesteUpdate',
                email: 'testeupdate@gmail.com'
            };
            helpers_1.request(helpers_1.app)
                .put("/api/users/" + 1 + "/update")
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .send(user)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                done(error);
            });
        });
    });
    describe('DELETE /api/users/:id/destroy', function () {
        it('Deve excluir um usuário', function (done) {
            helpers_1.request(helpers_1.app)
                .delete("/api/users/" + 1 + "/destroy")
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                done(error);
            });
        });
    });
});
