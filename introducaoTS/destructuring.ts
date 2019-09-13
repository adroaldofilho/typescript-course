var pessoa = {
  "nome" : "Adroaldo",
  "sobrenome" : "Aragao"
}
console.log(pessoa);

let nome, sobrenome;
({nome, sobrenome} = pessoa);

console.log(nome, sobrenome);
