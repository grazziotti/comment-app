describe('sign up', () => {
  it('should sign up successfully from the home page', () => {
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

  it('should show error if username already exists', () => {
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

    cy.get('p').contains('Username already in use.')
  })

  it('should show error if username does not have at leaset 4 characters', () => {
    // Visit the home page
    cy.visit('/')

    // Click on the sign up button on the home page
    cy.get('a[href="/signup"]').click()

    // Verify that the URL now contains '/signup
    cy.url().should('include', '/signup')

    // Enter the username
    cy.get('input[name="username"]').type('te')

    // Enter the password
    cy.get('input[name="password"]').type('testPassword1234@')

    // Confirm the password
    cy.get('input[name="confirmPassword"]').type('testPassword1234@')

    // Click the sign up button
    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('p').contains('Use at least 4 characters')
  })

  it('should show error if invalid password', () => {
    // Visit the home page
    cy.visit('/')

    // Click on the sign up button on the home page
    cy.get('a[href="/signup"]').click()

    // Verify that the URL now contains '/signup
    cy.url().should('include', '/signup')

    // Enter the username
    cy.get('input[name="username"]').type('test')

    // Enter the password
    cy.get('input[name="password"]').type('testPassword1234')

    // Confirm the password
    cy.get('input[name="confirmPassword"]').type('testPassword1234')

    // Click the sign up button
    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('.lucide-x').should('exist')
  })

  it('should show error if passwords do not match', () => {
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
    cy.get('input[name="confirmPassword"]').type('testPassword1234@@')

    cy.get('input').first().focus()

    // Click the sign up button
    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('p').contains('Passwords do not match')
  })
})
