describe('Authentication', () => {
    it('should sign in successfully', () => {
      cy.visit('/auth/signin');
      cy.get('input[name="email"]').type('hradmin@test.com');
      cy.get('input[name="password"]').type('TestPass1234');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/employees');
    });
  });
  