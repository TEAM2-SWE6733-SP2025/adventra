describe("Navigation", () => {
  it("should navigate to the about page", () => {
    cy.visit("http://localhost:3000/");

    const moveMouseSlowly = (startX, startY, endX, endY, steps, delay) => {
      const deltaX = (endX - startX) / steps;
      const deltaY = (endY - startY) / steps;

      for (let i = 0; i <= steps; i++) {
        const currentX = startX + deltaX * i;
        const currentY = startY + deltaY * i;

        cy.wait(delay);
        cy.get("body").trigger("mousemove", {
          clientX: currentX,
          clientY: currentY,
        });
      }
    };

    moveMouseSlowly(500, 500, 500, 0, 20, 100); // 20 steps, 100ms delay between steps

    cy.wait(1000);

    cy.get("nav a[href='/about']").then(($links) => {
      cy.log(`Found ${$links.length} matching elements`);
    });

    cy.get("nav a[href='/about']")
      .first()
      .should("exist")
      .should("be.visible")
      .click();

    cy.url().should("include", "/about");

    cy.get("h1").contains("Welcome");

    cy.wait(2000);
  });
});
