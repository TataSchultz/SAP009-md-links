#!/usr/bin/env	node
const {mdLinks}= require('./index.js');
const { chalk }= require('chalk');
const caminhoArquivo = process.argv[2];
console.log(process.argv);
const options ={
  validate: process.argv.includes('--validate'),
}


mdLinks(caminhoArquivo, options)
  .then((links) => {
    links.forEach((link) => {
      let status = link.status;
      if(status === 'Fail'){
        status = chalk.red(status);
      }
      const saida = formatarSaida(caminhoArquivo, options, link);
      process.stdout.write(saida);
    }); 
  })
  .catch((erro) => {
    console.error(erro);
  });
function formatarSaida (caminhoArquivo, options, link){
  if (!options.validate){
    return `${link.url} | ${caminhoArquivo}\n`;
    
} else{
  return `${link.status} | ${link.url} | ${caminhoArquivo}\n`;   
}
};