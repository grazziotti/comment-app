describe('login', () => {
  it('should log in successfully from the home page', () => {
    // Visit the home page
    cy.visit('/')

    // Click on the login button on the home page
    cy.get('a[href="/login"]').click()

    // Verify that the URL now contains '/login'
    cy.url().should('include', '/login')

    // Enter the username
    cy.get('input[name="username"]').type('test')

    // Enter the password
    cy.get('input[name="password"]').type('testPassword1234@')

    // Click the button to show the password
    cy.get('input[name="password"]').parent().find('button').click()

    // Verify the password value is visible in the input
    cy.get('input[name="password"]').should('have.value', 'testPassword1234@')

    // Verify the input type is now 'text'
    cy.get('input[name="password"]').should('have.attr', 'type', 'text')

    // Click the button to hide the password
    cy.get('input[name="password"]').parent().find('button').click()

    // Verify the input type is now 'password'
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')

    // Click the login button
    cy.get('button[type="submit"]').click()

    // Verify the user was redirected to the correct page after login
    cy.url().should('not.contain', '/login')

    // Verify that a specific element on the home page is present after login
    cy.get('header').should('contain', 'test')
  })

  it('should show an error message with incorrect credentials', () => {
    // Visit the home page
    cy.visit('/')

    // Click on the login button on the home page
    cy.get('a[href="/login"]').click()

    // Verify that the URL now contains '/login'
    cy.url().should('include', '/login')

    // Enter the username
    cy.get('input[name="username"]').type('test')

    // Enter an incorrect password
    cy.get('input[name="password"]').type('testPassword1234@@')

    // Click the login button
    cy.get('button[type="submit"]').click()

    // Verify the user remains on the login page
    cy.url().should('contain', '/login')

    // Verify that an error message is displayed
    cy.get('form').should('contain', 'Invalid username or password.')
  })
})
