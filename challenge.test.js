const { processUserTokenTopUp } = require("./challenge.js");

describe("processUserTokenTopUp", () => {
  test("should increase user tokens when user is active and a matching company is found", () => {
    // Set up the initial data
    const users = [
      {
        id: 1,
        first_name: "Tanya",
        last_name: "Nichols",
        email: "tanya.nichols@test.com",
        company_id: 2,
        email_status: true,
        active_status: false,
        tokens: 23,
      },
      {
        id: 2,
        first_name: "Brent",
        last_name: "Rodriquez",
        email: "brent.rodriquez@test.com",
        company_id: 1,
        email_status: false,
        active_status: true,
        tokens: 96,
      },
    ];
    const companies = [
      {
        id: 1,
        name: "Blue Cat Inc.",
        top_up: 71,
        email_status: false,
      },
      {
        id: 2,
        name: "Yellow Mouse Inc.",
        top_up: 37,
        email_status: true,
      },
    ];

    const expectedUsers = [
      {
        id: 1,
        first_name: "Tanya",
        last_name: "Nichols",
        email: "tanya.nichols@test.com",
        company_id: 2,
        email_status: true,
        active_status: false,
        tokens: 23,
      },
      {
        id: 2,
        first_name: "Brent",
        last_name: "Rodriquez",
        email: "brent.rodriquez@test.com",
        company_id: 1,
        email_status: false,
        active_status: true,
        tokens: 167, // 96 (orginal) + 71 (topup)
      },
    ];

    // Call the function
    processUserTokenTopUp(users, companies);

    // Assert the result
    expect(users).toEqual(expectedUsers);
  });

  test("should not change user tokens when user is inactive", () => {
    // Set up the initial data
    const users = [
      {
        id: 1,
        first_name: "Tanya",
        last_name: "Nichols",
        email: "tanya.nichols@test.com",
        company_id: 2,
        email_status: true,
        active_status: false,
        tokens: 23,
      },
      {
        id: 2,
        first_name: "Brent",
        last_name: "Rodriquez",
        email: "brent.rodriquez@test.com",
        company_id: 1,
        email_status: false,
        active_status: true,
        tokens: 96,
      },
    ];
    const companies = [
      {
        id: 1,
        name: "Blue Cat Inc.",
        top_up: 71,
        email_status: false,
      },
      {
        id: 2,
        name: "Yellow Mouse Inc.",
        top_up: 37,
        email_status: true,
      },
    ];

    const expectedUsers = [
      {
        id: 1,
        first_name: "Tanya",
        last_name: "Nichols",
        email: "tanya.nichols@test.com",
        company_id: 2,
        email_status: true,
        active_status: false,
        tokens: 23, // remains the same since active_status is false
      },
      {
        id: 2,
        first_name: "Brent",
        last_name: "Rodriquez",
        email: "brent.rodriquez@test.com",
        company_id: 1,
        email_status: false,
        active_status: true,
        tokens: 167, // 96 (orginal) + 71 (topup)
      },
    ];

    // Call the function
    processUserTokenTopUp(users, companies);

    // Assert the result
    expect(users).toEqual(expectedUsers);
  });

  test("should not change user tokens when no matching company is found", () => {
    // Set up the initial data
    const users = [
      {
        id: 1,
        first_name: "Tanya",
        last_name: "Nichols",
        email: "tanya.nichols@test.com",
        company_id: 2,
        email_status: true,
        active_status: true,
        tokens: 23,
      },
      {
        id: 2,
        first_name: "Brent",
        last_name: "Rodriquez",
        email: "brent.rodriquez@test.com",
        company_id: 3,
        email_status: false,
        active_status: true,
        tokens: 96,
      },
    ];
    const companies = [
      {
        id: 1,
        name: "Blue Cat Inc.",
        top_up: 71,
        email_status: false,
      },
      {
        id: 2,
        name: "Yellow Mouse Inc.",
        top_up: 37,
        email_status: true,
      },
    ];

    const expectedUsers = [
      {
        id: 1,
        first_name: "Tanya",
        last_name: "Nichols",
        email: "tanya.nichols@test.com",
        company_id: 2,
        email_status: true,
        active_status: true,
        tokens: 60,
      },
      {
        id: 2,
        first_name: "Brent",
        last_name: "Rodriquez",
        email: "brent.rodriquez@test.com",
        company_id: 3,
        email_status: false,
        active_status: true,
        tokens: 96,
      },
    ];

    // Call the function
    processUserTokenTopUp(users, companies);

    // Assert the result
    expect(users).toEqual(expectedUsers);
  });
});
