describe("Teste de adicionar resgate", () => {
  it("Deve preencher o formulário de resgate e submetê-lo", () => {
    
    cy.viewport(554, 679);

    cy.visit("http://localhost:3000/pages/rescue/addRescue");

    cy.get('[data-testid="time"]').type("12:00");

    cy.get('[data-testid="date"]').type("2023-10-05");

    cy.get('[data-testid="locationCoordinates"]').type("-23.5505, -46.6333");

    cy.get('[data-testid="getLocationButton"]').click();

    cy.get('[data-testid="AnimalGroup"]').click();


    //cy.get('[role="listbox"]').should("be.visible");

    cy.contains("span", "Mamifero", { timeout: 5000 })
      .should("be.visible")
      .click({ force: true });

    cy.get('[data-testid="Species"]').click();

    cy.contains("span", "Lobo - Canis lupus", { timeout: 5000 })
      .should("be.visible")
      .click({ force: true });

    cy.get('[data-testid="weight"]').type("15");

    cy.get('[data-testid="height"]').type("0.6");
    cy.get('[data-testid="length"]').type("1.0");
    cy.get('[data-testid="width"]').type("0.4");

    cy.get('[data-testid="adress"]').type("Rua Exemplo, 123");

    cy.get('[data-testid="occurrence"]').type(
      "Animal encontrado ferido na rua."
    );

    cy.get('[data-testid="calledBy"]').click();
    cy.contains("span", "Ouvidoria", { timeout: 5000 })
    .should("be.visible")
    .click({ force: true });

    cy.get('[data-testid="procedureBy"]').click();
    cy.contains("span", "Resgate", { timeout: 5000 })
    .should("be.visible")
    .click({ force: true });

    cy.get('[data-testid="ageRange"]').click();
    cy.contains("span", "Filhote", { timeout: 5000 })
    .should("be.visible")
    .click({ force: true });

    cy.get('[data-testid="situation"]').click();
    cy.contains("span", "Atropelamento", { timeout: 5000 })
    .should("be.visible")
    .click({ force: true });

    cy.get('[data-testid="postRescue"]').click();
    cy.contains("span", "Cetas", { timeout: 5000 })
    .should("be.visible")
    .click({ force: true });

    cy.get('[data-testid="observation"]').type(
      "Animal agressivo, cuidado ao manusear."
    );

    cy.get('[data-testid="releaseLocationCoordinates"]').type(
      "-23.5505, -46.6333"
    );

    cy.get('[data-testid="getReleaseLocationButton"]').click();

    cy.get("form").submit();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Registro criado com sucesso!');
    });
  });
});
