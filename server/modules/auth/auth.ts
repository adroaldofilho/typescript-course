import { Request, Response, response } from 'express';
import * as _ from 'lodash';
import User from '../User/service';
import Handlers from '../../api/responses/handlers';

const config = require('../../config/env/config')();

class TokenRoutes {
    auth(req: Request, res: Response){
        console.log('auth-modules PASSEI AQUI: ', req.body);
        const credentials = {
            email: req.body.email,
            password: req.body.password
        };
        console.log('email: ', credentials.email);
        if (credentials.hasOwnProperty('email') && credentials.hasOwnProperty('password')){
            User
                .getByEmail(credentials.email)
                .then(_.partial(Handlers.authSuccess, res, credentials))
                .catch(_.partial(Handlers.authFail, req, res));
        }
    }
}

export default new TokenRoutes();