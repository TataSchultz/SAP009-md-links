const { mdLinks }= require('../index'); 
const chalk = require('chalk');
const { validarLink } = require('../index');

jest.mock('fs', () => ({
  readFile: jest.fn((path, encoding, callback) => {
    const conteudo = '[Link 1](https://link1.com)\n[Link 2](https://link2.com)';
    callback(null, conteudo);
  }),
}));

describe('mdLinks', () => {
  it('deve retornar uma lista de links sem validação', () => {
    const path = 'caminho/do/arquivo.md';
    const options = { validate: false };
    return mdLinks(path, options).then((result) => {
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('texto');
      expect(result[0]).toHaveProperty('url');
      expect(result[0]).toHaveProperty('pasta');
    });
  });
  it('deve retornar uma lista de links com validação', () => {
    const path = 'caminho/do/arquivo.md';
    const options = { validate: true };
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200 })
    );
    expect(mdLinks(path, options)).resolves.toHaveLength(2);
  });
  it('deve retornar um erro se o arquivo não for encontrado', () => {
    const path = 'caminho/do/arquivo.md';
    const options = { validate: false };
    return mdLinks(path, options)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
  });
});
describe('validarLink', () => {
  it('deve retornar um objeto com status "Link Ok!" para um link válido', () => {
    const link = {
      texto: 'Link 1',
      url: 'https://link1.com'
    };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200 });
    return validarLink(link)
      .then((resultado) => {
        expect(resultado).toEqual({
          texto: 'Link 1',
          url: 'https://link1.com',
          status: '\u001b[34mLink Ok! cod:200\u001b[39m'
        });
      });
  });
  it('deve retornar um objeto com status "Link Fail!" para um link inválido', () => {
    const link = {
      texto: 'Link 2',
      url: 'https://link2.com'
    };
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    return validarLink(link)
      .then((resultado) => {
        expect(resultado).toEqual({
          texto: 'Link 2',
          url: 'https://link2.com',
          status: '\u001b[31mLink Fail! cod:404\u001b[39m'
        });
      });
  });
  it('deve retornar um objeto com status "Link Fail!" para um link que resulta em erro', () => {
    const link = {
      texto: 'Link 3',
      url: 'https://link3.com'
    };
    global.fetch = jest.fn().mockRejectedValue(new Error('Erro ao acessar o link'));
    return validarLink(link)
    .then((resultado) => {
      expect(resultado).toEqual({
        texto: 'Link 3',
        url: 'https://link3.com',
        status: chalk.red('Link Fail! cod:404')
      });
    });
});
});
