describe('sign up', () => {
  it('should sign up successfully from the home page', () => {
    cy.intercept('POST', 'http://localhost:4000/api/v1/user', {
      statusCode: 200,
      body: {
        success: true,
        message: 'User registered successfully'
      }
    }).as('registerUser')

    // Visit the home page
    cy.visit('/')

    // Click on the sign up button on the home page
    cy.get('a[href="/signup"]').click()

    // Verify that the URL now contains '/signup
    cy.url().should('include', '/signup')

    // Enter the username
    cy.get('input[name="username"]').type('test')

    // Enter the password
    cy.get('input[name="password"]').type('testPassword1234@')

    // Confirm the password
    cy.get('input[name="confirmPassword"]').type('testPassword1234@')

    // Click the sign up button
    cy.get('button[type="submit"]').click()

    // Verify the user was redirected to the correct page after login
    cy.url().should('not.contain', '/signup')

    // Verify that a specific element on the home page is present after login
    cy.get('header').should('contain', 'test')
  })
})
