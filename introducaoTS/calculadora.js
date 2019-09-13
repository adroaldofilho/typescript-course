var soma = (a, b) => a + b;
var subtracao = (a, b) => a - b;

var operacoes = {
    sum: function(x, y){
        return soma(x,y);
    },
    sub: function(x,y){
        return subtracao(x,y);
    }
}
exports.calculadora = operacoes;

var calculadora = require('./calculadora')