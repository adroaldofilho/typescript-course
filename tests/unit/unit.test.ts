import { testDouble, expect } from './config/helpers';
import User from '../../server/modules/User/service';
const model = require('../../server/models');

// model.sequelize.sync().then(() => {});
describe('Testes Unitários do Service', () => {
    let email;
    let _id;
    const defaultUser = {
        id: 1,
        name: 'Default User',
        email: 'defaultuser@email.com',
        password: '1234'
    }
    beforeEach(done =>{
        model.User.destroy({
            where: {}
        })
        .then(() => {
            model.User.create(defaultUser)
            .then(() => {
                console.log(' Default User created');
                done();
            });
        })
    });

    describe('Método Create', () => {
        
        it('Deve criar um novo usuário', () => {
            const novoUsuario = {
                id: 2,
                name: 'Novo Usuário Teste Unitário',
                email: 'testeunitario1@gmail.com',
                password: '1234'
            };
            return User.create(novoUsuario)
                    .then(data => {
                        expect(data.dataValues).to.have.all.keys(
                            ['email', 'id', 'name', 'password', 'updatedAt', 'createdAt']
                        )
                    })
        });
    });

    describe('Método GetAll', () => {
        it('Deve retornar todos os usuários', () => {
            User.getAll()
                .then(data => {
                    expect(data).to.be.an('array');
                })        
        });
    });

    describe('Método Update', () => {
        it('Deve retornar uma lista com todos os usuários', () => {
            const usuarioAtualizado = {
                name: 'Usuario Atualizado de Novo',
                email: 'usuarioatualizado@gmail.com',
                password: 'novasenha'
            }
            return User.update(defaultUser.id, usuarioAtualizado)
                    .then(data => {
                        expect(data[0]).to.be.equal(1);
                    })
        });
    });

    describe('Método Delete', () => {
        it('Deve excluir um novo usuário', () => {
            return User.delete(defaultUser.id)
                .then(data => {
                    expect(data).to.be.equal(1);
                })
        });
    });
    
    describe('Método GetById', () => {
        it('Deve retornar o usuário com id', () => {
            return User.getById(defaultUser.id)
                    .then(data => {
                        expect(data.id).to.be.equal(defaultUser.id);
                    })
        });
    });

    describe('Método GetByEmail', () => {
        it('Deve retornar o usuário com email', () => {
            return User.getByEmail(defaultUser.email)
                    .then(data => {
                        expect(data.id).to.be.equal(defaultUser.id);
                    })
        });
    });

});