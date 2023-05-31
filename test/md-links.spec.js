const mdLinks = require('../');
const fs = require('fs');

describe('mdLinks', () => {
  it('deve retornar os links corretos de um arquivo Markdown', () => {
    const path = './exemplo.md'; // Caminho para o arquivo Markdown de teste
    const expected = [
      {
        texto: 'Link 1',
        url: 'https://example.com/link1',
        arquivo: './exemplo.md',
      },
      {
        texto: 'Link 2',
        url: 'https://example.com/link2',
        arquivo: './exemplo.md',
      },
    ];

    return mdLinks(path).then((result) => {
      expect(result).toEqual(expected);
    });
  });

  it('deve rejeitar com uma mensagem de erro quando o arquivo não for encontrado', () => {
    const path = './caminho/inexistente.md'; // Caminho para um arquivo inexistente
    const expectedError = 'Arquivo não encontrado';

    return mdLinks(path).catch((error) => {
      expect(error).toContain(expectedError);
    });
  });
});
