/**
 * @jest-environment jsdom
 */

describe('AI Chat Assistant Logic', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    jest.resetModules();
    require('../js/main.js');
  });

  test('should return correct response for .net keyword', () => {
    // getAIResponse is global in main.js
    const response = window.getAIResponse('Parlami di .net');
    expect(response).toContain('.NET Core 6/8');
  });

  test('should return correct response for angular keyword', () => {
    const response = window.getAIResponse('Cosa sa fare con angular?');
    expect(response).toContain('Angular (attualmente v18+)');
  });

  test('should return correct response for ai keyword', () => {
    const response = window.getAIResponse('Esperienza con ai?');
    expect(response).toContain('OpenAI');
  });

  test('should return correct response for education keyword', () => {
    const response = window.getAIResponse('Sei laureato?');
    expect(response).toContain('Ingegneria Elettronica');
  });

  test('should return correct response for skills keyword', () => {
    const response = window.getAIResponse('Quali sono le tue skills?');
    expect(response).toContain('.NET Core');
  });

  test('should return correct response for contact keywords', () => {
    const responseEmail = window.getAIResponse('Qual è la tua email?');
    expect(responseEmail).toContain('paolopci@yahoo.it');
    
    const responsePhone = window.getAIResponse('Mi dai il tuo numero di telefono?');
    expect(responsePhone).toContain('+39 328 3834012');

    const responseLinkedin = window.getAIResponse('Link a linkedin?');
    expect(responseLinkedin).toContain('linkedin.com');
  });

  test('should return correct response for P.IVA keyword', () => {
    const response = window.getAIResponse('Hai la partita iva?');
    expect(response).toContain('non ha la Partita IVA');
  });

  test('should return correct response for soft skills', () => {
    const response = window.getAIResponse('Quali sono le tue soft skills?');
    expect(response).toContain('problem solving');
  });

  test('should return correct response for work mode', () => {
    const response = window.getAIResponse('Lavori in remoto?');
    expect(response).toContain('Full-Remote');
  });

  test('should return correct response for contract preference', () => {
    const response = window.getAIResponse('Che tipo di contratto cerchi?');
    expect(response).toContain('assunzione diretta');
  });

  test('should return correct response for NASpI keyword', () => {
    const response = window.getAIResponse('Sei un percettore NasPI?');
    expect(response).toContain('percettore NASpI');
  });

  test('should return correct responses for additional keywords', () => {
    const cases = [
      ['Parlami della tua esperienza', '10+ anni di esperienza in .NET e Angular'],
      ['Full stack', 'full-stack'],
      ['Microservizi', 'microservizi'],
      ['Entity Framework', 'Entity Framework'],
      ['Docker', 'Docker e containerizzazione'],
      ['Team remoto', 'team full-remote'],
      ['CI/CD', 'GitHub Actions'],
      ['GitHub Actions', 'GitHub Actions'],
      ['OpenAI', 'OpenAI'],
      ['Test', 'xUnit, Jest e Cypress'],
      ['Database', 'SQL Server, PostgreSQL e MongoDB'],
      ['E-commerce', 'e-commerce'],
      ['JWT', 'JWT, OAuth'],
      ['OAuth', 'JWT, OAuth'],
      ['Azure', 'Azure (livello base)'],
      ['Open source', 'open-source'],
      ['Prestazioni', 'performance frontend'],
      ['Postman', 'Postman/Swagger'],
      ['Swagger', 'Postman/Swagger'],
    ];

    cases.forEach(([input, expected]) => {
      const response = window.getAIResponse(input);
      expect(response).toContain(expected);
    });
  });

  test('should return default response for unknown topics', () => {
    const response = window.getAIResponse('Cosa ne pensi della pizza?');
    expect(response).toContain('Interessante!');
  });
});
