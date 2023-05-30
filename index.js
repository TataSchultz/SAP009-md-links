const fs = require('fs');

// Função para ler o arquivo e extrair os links
function mdLinks(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (erro, conteudo) => {
      if (erro) {
        reject('Arquivo não encontrado: ' + erro);
      } else {
        const regex = /\[([^\]]+)\]\(([^\)]+)\)/g; // Expressão regular para encontrar links
        const links = [];
        let match;
        while ((match = regex.exec(conteudo)) !== null) {
          const textoLink = match[1];
          const urlLink = match[2];
          // const arquivo = match[3];
          links.push({ texto: textoLink, url: urlLink, arquivo: path });
        }
        resolve(links);
      }
    });
  });
}

module.exports = mdLinks;



