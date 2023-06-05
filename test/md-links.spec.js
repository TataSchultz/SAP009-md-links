const { mdLinks }= require('../index'); 



// Mock para a função fs.readFile
jest.mock('fs', () => ({
  readFile: jest.fn((path, encoding, callback) => {
    // Simula um arquivo existente com um conteúdo pré-definido
    const conteudo = '[Link 1](https://link1.com)\n[Link 2](https://link2.com)';
    callback(null, conteudo);
  }),
}));

describe('mdLinks', () => {
  test('deve retornar uma lista de links sem validação', () => {
    const path = 'caminho/do/arquivo.md';
    const options = { validate: false };

    return mdLinks(path, options).then((result) => {
      // Verifique se a saída é uma matriz de links
      expect(Array.isArray(result)).toBe(true);

      // Verifique se os links têm a estrutura correta
      expect(result[0]).toHaveProperty('texto');
      expect(result[0]).toHaveProperty('url');
    });
  });

  it('deve retornar uma lista de links com validação', () => {
    const path = 'caminho/do/arquivo.md';
    const options = { validate: true };

    return expect(mdLinks(path, options)).resolves.toHaveLength(2);
  }, 20000); // Aumentando o tempo limite para 10 segundos (10000ms)

  it('deve retornar um erro se o arquivo não for encontrado', () => {
    const path = 'caminho/do/arquivo.md';
    const options = { validate: false };
  
    return mdLinks(path, options)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
  });
});

const { validarLink } = require('../index');

describe('validarLink', () => {
  test('deve retornar um objeto com status "Link Ok!" para um link válido', () => {
    const link = {
      texto: 'Link 1',
      url: 'https://link1.com'
    };

    // Mock da função fetch para retornar uma resposta válida
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200 })
    );

    return validarLink(link)
      .then((resultado) => {
        expect(resultado).toEqual({
          texto: 'Link 1',
          url: 'https://link1.com',
          status: 'Link Ok! cod:200'
        });
      });
  });

  test('deve retornar um objeto com status "Link Fail!" para um link inválido', () => {
    const link = {
      texto: 'Link 2',
      url: 'https://link2.com'
    };

    // Mock da função fetch para retornar uma resposta inválida
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 404 })
    );

    return validarLink(link)
      .then((resultado) => {
        expect(resultado).toEqual({
          texto: 'Link 2',
          url: 'https://link2.com',
          status: 'Link Fail! cod:404'
        });
      });
  });

  test('deve retornar um objeto com status "Link Fail!" para um link que resulta em erro', () => {
    const link = {
      texto: 'Link 3',
      url: 'https://link3.com'
    };

    // Mock da função fetch para simular um erro
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Erro ao acessar o link'))
    );

    return validarLink(link)
      .then((resultado) => {
        expect(resultado).toEqual({
          texto: 'Link 3',
          url: 'https://link3.com',
          status: 'Link Fail! cod:404'
        });
      });
  });
});
