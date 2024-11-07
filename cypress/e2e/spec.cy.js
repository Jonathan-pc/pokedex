describe('Carga de Pokémon', () => {
  it('debería cargar los Pokémon en la página', () => {
    cy.visit('index.html');
    cy.get('#pokemonContainer').should('exist');
    cy.get('.pokemon-card').should('have.length.greaterThan', 0);
  });
});

describe('Paginación', () => {
  it('debería cargar más Pokémon al hacer clic en "Siguiente"', () => {
    cy.visit('index.html');
    cy.get('#nextPage').click();
    cy.get('.pokemon-card').should('have.length.greaterThan', 0);
  });
});

describe('Búsqueda de Pokémon', () => {
  it('debería mostrar un Pokémon al buscarlo', () => {
    cy.visit('index.html');
    cy.get('#pokemonSearch').type('pikachu'); 
    cy.get('#searchButton').click(); 
    cy.get('.pokemon-detail-card').should('exist'); 
  });

  it('debería mostrar un mensaje de error si el Pokémon no se encuentra', () => {
    cy.visit('index.html');
    cy.get('#pokemonSearch').type('pokemoninexistente'); 
    cy.get('#searchButton').click();
    cy.get('.error-message').should('exist'); 
  });
});

describe('Cambio de tema', () => {
  it('debería cambiar entre tema claro y oscuro', () => {
    cy.visit('index.html');
    
    cy.get('body').should('have.class', 'light-mode');

    cy.get('#toggleTheme').click();
    cy.get('body').should('have.class', 'dark-mode'); 


    cy.get('#toggleTheme').click();
    cy.get('body').should('have.class', 'light-mode');
  });
});

describe('Botón "Mostrar Todos"', () => {
  it('debería mostrar todos los Pokémon al hacer clic en "Mostrar Todos"', () => {
    cy.visit('index.html');
    cy.get('#showAllButton').click();
    cy.get('.pokemon-card').should('have.length.greaterThan', 0);
  });
});
