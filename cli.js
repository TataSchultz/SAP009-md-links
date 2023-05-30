#!/usr/bin/env	node
const mdLinks = require('./index.js');
const caminhoArquivo = process.argv[2];
console.log(process.argv);
// Ler o conteúdo do arquivo e extrair os links
mdLinks(caminhoArquivo)
  .then((links) => {
    console.log('Links encontrados:', links);
  })
  .catch((erro) => {
    console.error(erro);
  });
