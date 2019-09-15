"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./config/helpers");
var service_1 = require("../../server/modules/User/service");
var model = require('../../server/models');
// model.sequelize.sync().then(() => {});
describe('Testes Unitários do Service', function () {
    var email;
    var _id;
    var defaultUser = {
        id: 1,
        name: 'Default User',
        email: 'defaultuser@email.com',
        password: '1234'
    };
    beforeEach(function (done) {
        model.User.destroy({
            where: {}
        })
            .then(function () {
            model.User.create(defaultUser)
                .then(function () {
                console.log(' Default User created');
                done();
            });
        });
    });
    describe('Método Create', function () {
        it('Deve criar um novo usuário', function () {
            var novoUsuario = {
                id: 2,
                name: 'Novo Usuário Teste Unitário',
                email: 'testeunitario1@gmail.com',
                password: '1234'
            };
            return service_1.default.create(novoUsuario)
                .then(function (data) {
                helpers_1.expect(data.dataValues).to.have.all.keys(['email', 'id', 'name', 'password', 'updatedAt', 'createdAt']);
            });
        });
    });
    describe('Método GetAll', function () {
        it('Deve retornar todos os usuários', function () {
            service_1.default.getAll()
                .then(function (data) {
                helpers_1.expect(data).to.be.an('array');
            });
        });
    });
    describe('Método Update', function () {
        it('Deve retornar uma lista com todos os usuários', function () {
            var usuarioAtualizado = {
                name: 'Usuario Atualizado de Novo',
                email: 'usuarioatualizado@gmail.com',
                password: 'novasenha'
            };
            return service_1.default.update(defaultUser.id, usuarioAtualizado)
                .then(function (data) {
                helpers_1.expect(data[0]).to.be.equal(1);
            });
        });
    });
    describe('Método Delete', function () {
        it('Deve excluir um novo usuário', function () {
            return service_1.default.delete(defaultUser.id)
                .then(function (data) {
                helpers_1.expect(data).to.be.equal(1);
            });
        });
    });
    describe('Método GetById', function () {
        it('Deve retornar o usuário com id', function () {
            return service_1.default.getById(defaultUser.id)
                .then(function (data) {
                helpers_1.expect(data.id).to.be.equal(defaultUser.id);
            });
        });
    });
    describe('Método GetByEmail', function () {
        it('Deve retornar o usuário com email', function () {
            return service_1.default.getByEmail(defaultUser.email)
                .then(function (data) {
                helpers_1.expect(data.id).to.be.equal(defaultUser.id);
            });
        });
    });
});
