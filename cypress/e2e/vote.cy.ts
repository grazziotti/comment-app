describe('vote', () => {
  it('should redirect to login page if user tries to vote without being logged in', () => {
    cy.visit('/', { failOnStatusCode: false })

    cy.wait(3000)

    // Click on the first vote button
    cy.get('ul li button').first().click()

    // Verify that the URL contains '/login', indicating redirection
    cy.url().should('contain', '/login')
  })

  describe('beforeEach', () => {
    // Before each test, ensure the user is logged in
    beforeEach(() => {
      cy.visit('/', { failOnStatusCode: false })

      // Click the login link
      cy.get('a[href="/login"]').click()

      // Verify that the URL is correct for the login page
      cy.url().should('include', '/login')

      // Fill in the username
      cy.get('input[name="username"]').type('test')

      // Fill in the password
      cy.get('input[name="password"]').type('testPassword1234@')

      // Toggle the password visibility and ensure the correct value
      cy.get('input[name="password"]').parent().find('button').click()
      cy.get('input[name="password"]').should('have.value', 'testPassword1234@')
      cy.get('input[name="password"]').should('have.attr', 'type', 'text')

      // Toggle the password visibility back to hidden
      cy.get('input[name="password"]').parent().find('button').click()
      cy.get('input[name="password"]').should('have.attr', 'type', 'password')

      // Submit the login form
      cy.get('button[type="submit"]').click()

      // Verify that the user is no longer on the login page after submission
      cy.url().should('not.contain', '/login')

      // Ensure that the header contains the logged-in user's name
      cy.get('header').should('contain', 'test')
    })

    it('should allow the logged-in user to upvote a comment', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Verify that the initial vote count is 0
      cy.get('ul li span')
        .first()
        .invoke('text')
        .then((spanText) => {
          expect(spanText.trim()).to.eq('0')
        })

      // Click the upvote button
      cy.get('ul li button').first().click()

      cy.wait(3000)

      // Verify that the vote count has increased to 1
      cy.get('ul li span')
        .first()
        .invoke('text')
        .then((spanText) => {
          expect(spanText.trim()).to.eq('1')
        })
    })

    it('should allow the logged-in user to remove their upvote from a comment', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Verify that the initial vote count is 1 (after upvote)
      cy.get('ul li span')
        .first()
        .invoke('text')
        .then((spanText) => {
          expect(spanText.trim()).to.eq('1')
        })

      // Click the upvote button again to remove the vote
      cy.get('ul li button').first().click()

      cy.wait(3000)

      // Verify that the vote count has returned to 0
      cy.get('ul li span')
        .first()
        .invoke('text')
        .then((spanText) => {
          expect(spanText.trim()).to.eq('0')
        })
    })

    it('should allow the logged-in user to downvote a comment', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Verify that the initial vote count is 0
      cy.get('ul li span')
        .first()
        .invoke('text')
        .then((spanText) => {
          expect(spanText.trim()).to.eq('0')
        })

      // Click the downvote button
      cy.get('ul li button').eq(1).click()

      cy.wait(3000)

      // Verify that the vote count has decreased to -1
      cy.get('ul li span')
        .first()
        .invoke('text')
        .then((spanText) => {
          expect(spanText.trim()).to.eq('-1')
        })
    })

    it('should allow the logged-in user to remove their downvote from a comment', () => {
      cy.visit('/', { failOnStatusCode: false })

      cy.wait(3000)

      // Verify that the initial vote count is -1 (after downvote)
      cy.get('ul li span')
        .first()
        .invoke('text')
        .then((spanText) => {
          expect(spanText.trim()).to.eq('-1')
        })

      // Click the downvote button again to remove the vote
      cy.get('ul li button').eq(1).click()

      cy.wait(3000)

      // Verify that the vote count has returned to 0
      cy.get('ul li span')
        .first()
        .invoke('text')
        .then((spanText) => {
          expect(spanText.trim()).to.eq('0')
        })
    })
  })
})
