const fs = require('fs');
// const chalk = require('chalk');
// Função para ler o arquivo e extrair os links
// function mdLinks(path) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, 'utf-8', (erro, conteudo) => {
//       if (erro) {
//         reject('Arquivo não encontrado: ' + erro);
//       } else {
//         const regex = /\[([^\]]+)\]\(([^\)]+)\)/g; // Expressão regular para encontrar links
//         const links = [];
//         let match;
//         while ((match = regex.exec(conteudo)) !== null) {
//           const textoLink = match[1];
//           const urlLink = match[2];
//           // const arquivo = match[3];
//           links.push({ texto: textoLink, url: urlLink, arquivo: path });
//         }
//         resolve(links);
//       }
//     });
//   });
// }
// const fs = require('fs');
// const fetch = require('node-fetch');

// function validarLink(link) {
//   return fetch(link.url.href)
//     .then((res) => {
//       return { ...link, status: res.status };
//     })
//     .catch(() => {
//       return { ...link, status: 404 }; // Pode ajustar o status de acordo com a situação de erro
//     });
// }

// function mdLinks(path) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, 'utf-8', (erro, conteudo) => {
//       if (erro) {
//         reject('Arquivo não encontrado: ' + erro);
//       } else {
//         const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
//         const links = [];
//         let match;
//         while ((match = regex.exec(conteudo)) !== null) {
//           const textoLink = match[1];
//           const urlLink = match[2];
//           const urlObj = new URL(urlLink);
//           links.push({ texto: textoLink, url: urlObj });
//         }

//         const promises = links.map((link) => validarLink(link));

//         Promise.all(promises)
//           .then((linksValidados) => {
//             resolve(linksValidados);
//           })
//           .catch((erro) => {
//             reject('Erro ao validar os links: ' + erro);
//           });
//       }
//     });
//   });
// }
// const fs = require('fs');
// const fetch = require('node-fetch');


function validarLink(link) {
  return fetch(link.url.href)
    .then((res) => {
      return {
        texto: link.texto,
        url: link.url.href,
        status: 'Link Ok! cod:' + res.status
      };
    })
    .catch(() => {
      return {
        texto: link.texto,
        url: link.url.href,
        status: 'Link Fail! cod:'+ 400 // Pode ajustar o código de erro de acordo com a situação de erro
      };
    });
}

function mdLinks(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (erro, conteudo) => {
      if (erro) {
        reject('Arquivo não encontrado: ' + erro);
      } else {
        const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
        const links = [];
        let match;
        while ((match = regex.exec(conteudo)) !== null) {
          const textoLink = match[1];
          const urlLink = match[2];
          const urlObj = new URL(urlLink);
          links.push({ texto: textoLink, url: urlObj });
        }

        const promises = links.map((link) => validarLink(link));

        Promise.all(promises)
          .then((linksValidados) => {
            resolve(linksValidados);
          })
          .catch((erro) => {
            reject('Erro ao validar os links: ' + erro);
          });
      }
    });
  });
}


module.exports = mdLinks;



