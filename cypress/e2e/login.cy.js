/* eslint-disable quotes */
describe("User Login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/signin");
  });

  it("logs in successfully with valid credentials", () => {
    cy.get('input[placeholder="Enter your email"]').type(
      "louis.muhammad@gmail.com"
    );

    cy.get('input[placeholder="Enter your password"]').type("Test12345!");

    cy.contains("button", "Sign In").click();

    cy.url().should("include", "/");
  });
});
