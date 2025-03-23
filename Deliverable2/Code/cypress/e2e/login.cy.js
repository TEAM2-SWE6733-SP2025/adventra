/* eslint-disable quotes */
describe("User Login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/signin");
  });

  it("logs in successfully with valid credentials", () => {
    cy.get('input[placeholder="Email"]').type("louis.muhammad@gmail.com");

    cy.get('input[placeholder="Password"]').type("Test12345!");

    cy.get('button[type="submit"]').contains("Sign In with Email").click();

    cy.url().should("include", "/");
  });
});
