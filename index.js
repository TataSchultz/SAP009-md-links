const fs = require('fs');
const chalk = require('chalk');

function validarLink(link) {
  return fetch(link.url)
    .then((res) => {
      if(res.ok){
        return {
          texto: link.texto,
          url: link.url,
          status: chalk.blue('Link Ok! cod:' + res.status),
      };
      } else{ 
        return {
          texto: link.texto,
          url: link.url,
          status: chalk.red('Link Fail! cod:' + (error.status || 404)),
        };
      };
    })
    .catch((error) => {
      return {
        texto: link.texto,
        url: link.url,
        status: chalk.red('Link Fail! cod:' + (error.status || 404)),
      };
    });
};
function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (erro, conteudo) => {
      if (erro) {
        reject(new Error ('Arquivo/Diretório não encontrado' + erro));
        return;
      } else {
        const regex = /\[([^\]]+)\]\(([^\)]+)\)/gm;
        const links = [];
        let match;
        while ((match = regex.exec(conteudo)) !== null) {
          const textoLink = match[1];
          const urlLink = match[2];
          const caminhoLink = path
           links.push({ texto: textoLink, url: urlLink, pasta:caminhoLink });
        }
        if(options.validate){
          const promises = links.map((link) => validarLink(link));
          return Promise.all(promises)
            .then((linksValidados) => {
              resolve(linksValidados);
            })
            .catch((erro) => {
              reject(new Error ('Erro ao validar os links: ' + erro));
            });
        } else{
          resolve(links);
        }
        } 
    });
  });
}
module.exports ={ mdLinks, validarLink };




