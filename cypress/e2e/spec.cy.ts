describe("template spec", () => {
  it("passes", () => {
    const fromCities = ["Barcelona, Spain"];
    const toCities = ["Izmir, Turkey"];

    const results = [];
    cy.visit(
      "https://www.maersk.com/schedules/pointToPoint?from=3TZA3JGPJXNY7&to=1FQMCYMU9XLZ2&containerIsoCode=42G1&fromServiceMode=CY&toServiceMode=CY&numberOfWeeks=4&dateType=D&date=2023-02-02&vesselFlag="
    );
    for (let i = 0; i < fromCities.length + 1; i++) {
      cy.get(".schedules-view__results")
        .children('[data-test="results-list"]')
        .find('[data-test="show-details-link"]')
        .click({ multiple: true, force: true });

      cy.get(".schedules-view__results")
        .children('[data-test="results-list"]')

        .each(($div, index) => {
          const departureDate = $div
            .find('[data-test="departure-date"]')
            .text();

          const departureText = $div
            .find('[data-test="transport-plan"]')
            .find(".ptp-results__transport-plan--item")
            .find('[data-test="location-name"]')[0].innerText;

          const departure = {
            city: departureText.split("\n")[0],
            location: departureText.split("\n")[1],
          };

          const arrivalText = $div
            .find('[data-test="transport-plan"]')
            .find(".ptp-results__transport-plan--item-final")
            .find('[data-test="location-name"]')[0].innerText;

          const arrival = {
            city: arrivalText.split("\n")[0],
            location: arrivalText.split("\n")[1],
          };

          const imoNumber = $div
            .find('[data-test="transport-plan"]')
            .find(".imo")
            .children()[1].innerText;

          const flag = $div
            .find('[data-test="transport-plan"]')
            .find(".flag")
            .children()[1].innerText;

          const built = $div
            .find('[data-test="transport-plan"]')
            .find(".built")
            .children()[1].innerText;

          const service = $div
            .find('[data-test="transport-plan"]')
            .find(".service")
            .children()[1].innerText;

          const callSign = $div
            .find('[data-test="transport-plan"]')
            .find(".callsign")
            .children()[1].innerText;

          const arrivalDate = $div.find('[data-test="arrival-date"]').text();
          const vessel = $div.find('[data-test="vessel-link"]').text();
          const day = $div
            .find(".results__schedule--cell.vessel")
            .find('[class="font--default--bold"]')
            .text();

          const deadLine = {
            "container-gate-in": $div.find('[data-test="deadline-value"]')[0]
              .innerText,
            "shipping-instructions": $div.find(
              '[data-test="deadline-value"]'
            )[1].innerText,
            "shipping-instructions-ams": $div.find(
              '[data-test="deadline-value"]'
            )[2].innerText,
            "verified-gross-mass": $div.find('[data-test="deadline-value"]')[3]
              .innerText,
          };
          $div.find('[data-test="deadline-value"]').text();
          results.push({
            day,
            imoNumber,
            flag,
            built,
            service,
            callSign,
            departureDate,
            departure,
            arrivalDate,
            arrival,
            vessel,
            deadLine,
          });
        })
        .then(() => {
          console.log("log", results);
        });
      if (i !== fromCities.length) {
        cy.get("#originLocation")
          .clear({ force: true })
          .type(fromCities[i], { force: true ,delay: 500});
        cy.get("#destinationLocation")
          .clear({ force: true })
          .type(toCities[i], { force: true, delay: 500 });
        cy.get('[data-test="typeaheadOption-0"]').click({
          force: true,
          multiple: true,
        });
        cy.get('[data-test="optionsContainerList-0"]').click({
          force: true,
          multiple: true,
        });

        cy.get("#app")
          .find('[data-test="ptp-search-button"]')
          .click({ force: true });
      }
    }
  });
});
