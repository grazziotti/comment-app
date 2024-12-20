describe('comment', () => {
  it('should redirect to login page if user tries to comment without being logged in', () => {
    cy.visit('/', { failOnStatusCode: false })

    cy.wait(3000)

    cy.get('textarea[placeholder="Add a comment..."]').last().click()

    cy.url().should('contain', '/login')
  })

  describe('beforeEach', () => {
    beforeEach(() => {
      // Visit the home page
      cy.visit('/', { failOnStatusCode: false })

      // Click on the login button on the home page
      cy.get('a[href="/login"]').click()

      // Verify that the URL now contains '/login'
      cy.url().should('include', '/login')

      // Enter the username
      cy.get('input[name="username"]').type('test')

      // Enter the password
      cy.get('input[name="password"]').type('testPassword1234@')

      // Toggle password visibility to verify the entered password
      cy.get('input[name="password"]').parent().find('button').click()
      cy.get('input[name="password"]').should('have.value', 'testPassword1234@')
      cy.get('input[name="password"]').should('have.attr', 'type', 'text')

      // Toggle password visibility back to 'password' type
      cy.get('input[name="password"]').parent().find('button').click()
      cy.get('input[name="password"]').should('have.attr', 'type', 'password')

      // Submit the login form
      cy.get('button[type="submit"]').click()

      // Verify successful login by checking the URL
      cy.url().should('not.contain', '/login')

      // Confirm that the user is logged in by checking the header
      cy.get('header').should('contain', 'test')
    })

    it('should successfully post a new comment', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Type a new comment and submit
      cy.get('textarea[placeholder="Add a comment..."]')
        .last()
        .type('test comment')

      cy.contains('button', 'SEND').click()

      // Verify the new comment appears in the list
      cy.get('ul li p').contains('test comment')
    })

    it('should allow the logged-in user to edit their existing comment', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Locate the comment and click the edit button
      cy.get('ul li p').contains('test comment')
      cy.contains('button', 'Edit').click()

      // Modify the comment and submit the changes
      cy.get('textarea[placeholder="Add a comment..."]').last().type(' edited!')
      cy.contains('button', 'UPDATE').first().click()

      // Verify the comment has been updated
      cy.contains('span', '(edited)')
      cy.get('ul li p').contains('test comment edited!')
    })

    it('should allow the logged-in user to delete their existing comment', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Locate the comment and click the delete button
      cy.get('ul li p').contains('test comment')
      cy.contains('button', 'Delete').click()

      // Confirm deletion
      cy.contains('button', 'YES, DELETE').click()

      // Verify the comment has been removed
      cy.contains('test comment edited!').should('not.exist')
    })

    it('should allow the user to post a reply to another users comment', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Click the reply button for the comment
      cy.get('ul li').contains('button', 'Reply').click()

      cy.wait(1000)

      // Type and submit the reply
      cy.get('ul li textarea').last().type('test reply!')
      cy.contains('button', 'REPLY').click()

      // Verify the reply appears in the comment list
      cy.get('ul li ul li p').contains('test reply!')
    })

    it('should allow the logged-in user to edit their reply', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      cy.contains('button', 'replies').click()

      // Locate the reply and click the edit button
      cy.get('ul li ul li p').contains('test reply!')
      cy.contains('button', 'Edit').click()

      // Modify the reply and submit the changes
      cy.get('textarea').last().type(' edited!')
      cy.contains('button', 'UPDATE').first().click()

      // Verify the reply has been updated
      cy.contains('span', '(edited)')
      cy.get('ul li p').contains('test reply! edited!')
    })

    it('should allow the logged-in user to delete their reply', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Locate the reply and click the delete button
      cy.contains('button', 'replies').click()

      cy.get('ul li ul li p').contains('test reply!')
      cy.contains('button', 'Delete').click()

      // Confirm deletion
      cy.contains('button', 'YES, DELETE').click()

      // Verify the reply has been removed
      cy.contains('test reply!').should('not.exist')
    })
  })
})
