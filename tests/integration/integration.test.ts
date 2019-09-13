import { app, expect, request } from './config/helpers';
import * as HTTPStatus from 'http-status';
import httpStatus = require('http-status');
import * as jwt from 'jwt-simple';

describe('Testes de Integração', () => {

    'use strict';
    const config = require('../../server/config/env/config')();
    const model = require('../../server/models');
    let id;
    let token;
    let tokenRecebido;

    const userTest = {
        id: 100,
        name: 'Usuário Teste',
        email: 'teste@gmail.com',
        password: 'teste'
    }
    const userDefault = {
        id: 1,
        name: 'Adroaldo',
        email: 'adroaldoaragao@gmail.com',
        password: '123'
    }

    beforeEach((done) => {
        model.User.destroy({
            where:{}
        })
        .then(() => {
            return model.User.create(userDefault);
        })
        .then(() => {
            return model.User.create(userTest)
            .then(() => {
                token = jwt.encode({ id: userDefault.id}, config.secret);
                done();
            })
        })
    });

    describe('POST /token', () => {
        it('Deve receber um JWT token', done => {
            const credentials = {
                email: userDefault.email,
                password: userDefault.password 
            };
            request(app)
            .post('/token')
            .send(credentials)
            .end((error, res) => {
                tokenRecebido = res.body.token;
                expect(res.status).to.equal(HTTPStatus.OK);
                expect(res.body.token).to.equal(`${token}`);
                done(error);
            })
        });
        it('Não deve gerar token', done => {
            const credentials = {
                email: 'qualquer@qualquer.com',
                password: 'qualquer' 
            };
            request(app)
            .post('/token')
            .send(credentials)
            .end((error, res) => {
                expect(res.status).to.equal(HTTPStatus.UNAUTHORIZED);
                expect(res.body).to.empty;
                done(error);
            })
        });

    });
    describe('GET /api/users/all', () => {
        it('Deve retornar um ARRAY com todos os usuários', done => {
            console.log('token gerado: ', token);
            console.log('token recebido: ', tokenRecebido)
            request(app)
            .get('/api/users/all')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((error, res) => {
                console.log(res.status, token);
                expect(res.status).to.equal(HTTPStatus.OK);
                expect(res.body.payload).to.be.an('array');
                expect(res.body.payload[0].name).to.be.equal(userDefault.name);
                expect(res.body.payload[0].email).to.be.equal(userDefault.email);
                done(error);
            })
        });
    });
    describe('GET /api/users/:id', () => {
        it('Deve retornar um usuário', done => {
            request(app)
            .get(`/api/users/${userTest.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((error, res) => {
                expect(res.status).to.equal(HTTPStatus.OK);
                expect(res.body.payload.name).to.equal(userTest.name);
                expect(res.body.payload).to.have.all.keys([
                    'email', 'id', 'name', 'password'
                ]);
                id = res.body.payload.id;
                done(error);
            })
        });
    });
    describe('POST /api/users/create', () => {
        it('Deve criar um novo usuário', done => {
            const user = {
                id: 2,
                name: 'Usuário 2 para Teste',
                email: 'teste2@gmail.com',
                password: 'teste2'
            }
            request(app)
            .post('/api/users/create')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .end((error, res) => {
                expect(res.status).to.equal(HTTPStatus.OK);
                expect(res.body.payload.id).to.eql(user.id);
                expect(res.body.payload.name).to.eql(user.name);
                expect(res.body.payload.email).to.eql(user.email);
                done(error);
            })
        });
    });
    describe('PUT /api/users/:id/update', () => {
        it('Deve atualizar um usuário', done => {
            const user = {
                name: 'TesteUpdate',
                email: 'testeupdate@gmail.com'
            }
            request(app)
            .put(`/api/users/${1}/update`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .end((error, res) => {
                expect(res.status).to.equal(HTTPStatus.OK);
                done(error);
            })            
        });
    });
    describe('DELETE /api/users/:id/destroy', () => {
        it('Deve excluir um usuário', done => {
            request(app)
            .delete(`/api/users/${1}/destroy`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((error, res) => {
                expect(res.status).to.equal(HTTPStatus.OK);
                done(error);
            })            
        });
    });    
});