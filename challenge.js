const fs = require("fs");

const USERS_FILE_PATH = "./users.json";
const COMPANIES_FILE_PATH = "./companies.json";

/**
 * Reads file then returns a Promise of the file content.
 *
 * @param {string} filePath - The path to the file to be read.
 * @returns {Promise<string>} A promise that resolves with the content of the file as a string.
 */
const readFilePromise = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        const error = new Error(`Error reading file: ${filePath}`);
        reject(error);
        return;
      }

      try {
        const parsedData = JSON.parse(data);
        resolve(parsedData);
      } catch (parseError) {
        const error = new Error(`Error parsing JSON in file: ${filePath}`);
        reject(error);
      }
    });
  });
};

/**
 *Processes user token top-up based on their company and active status.
 *@param {Array<Object>} users - An array of user objects.
 *@param {Array<Object>} companies - An array of company objects.
 *@returns {void}
 */
const processUserTokenTopUp = (users, companies) => {
  users.forEach((user) => {
    const foundCompany = companies.find(
      (company) => company.id === user.company_id
    );

    if (foundCompany && user.active_status) {
      user.tokens += foundCompany.top_up;
    }
  });
};

/**
 * Formats the users and companies data into a specific output format.
 *
 * @param {Array<Object>} users - The array of user objects.
 * @param {Array<Object>} companies - The array of company objects.
 * @returns {string} - The formatted output string.
 */
const formatOutput = (users, companies) => {
  let output = "";

  companies.forEach((company) => {
    output += `Company Id: ${company.id}\n`;
    output += `Company Name: ${company.name}\n`;
    output += `Users Emailed:\n`;

    const emailedUsers = users.filter(
      (user) =>
        user.company_id === company.id &&
        company.email_status === true &&
        user.email_status === true
    );

    emailedUsers.forEach((user) => {
      output += `\t${user.last_name}, ${user.first_name}, ${user.email}\n`;
      output += `\t  Previous Token Balance: ${user.tokens - company.top_up}\n`;
      output += `\t  New Token Balance: ${user.tokens}\n`;
    });

    output += `Users Not Emailed:\n`;

    const notEmailedUsers = users.filter(
      (user) =>
        user.company_id === company.id &&
        (company.email_status === false || user.email_status === false)
    );

    notEmailedUsers.forEach((user) => {
      output += `\t${user.last_name}, ${user.first_name}, ${user.email}\n`;
      output += `\t  Previous Token Balance: ${user.tokens - company.top_up}\n`;
      output += `\t  New Token Balance: ${user.tokens}\n`;
    });

    output += `Total amount of top ups for ${company.name}: ${
      company.top_up * (emailedUsers.length + notEmailedUsers.length)
    }\n\n`;
  });

  // Remove trailing whitespace
  return output.trim();
};

/**
 * Writes the provided output to an output.txt file.
 *
 * @param {string} output - The formatted output to be written to the file.
 * @returns {Promise<void>} A promise that resolves if the file is written successfully, or rejects with an error if there is an error.
 */
const createOutputFile = (output) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("./output.txt", output, "utf8", (err) => {
      if (err) {
        const error = new Error(`Error creating file: ${error}`);
        reject(error);
        return;
      }

      console.log("Output file (output.txt) has been created.");
      resolve();
    });
  });
};

/**
 * Reads user and company data from JSON files asynchronously.
 *
 * @param {Array<string>} filePaths - An array of file paths.
 * @returns {Promise<Array>} A promise that resolves with an array containing the data read from the files.
 * @throws {Error} If there is an error reading the files.
 */
const readJSONData = async (filePaths) => {
  try {
    const fileData = await Promise.all(
      filePaths.map((filePath) => readFilePromise(filePath))
    );

    return fileData;
  } catch (err) {
    console.log("Error reading file:", err);
    throw err;
  }
};

/**
 * Executes the take-home solution process asynchronously.
 *
 * @returns {Promise<void>} A promise that resolves once the take-home solution process is completed.
 * @throws {Error} If there is an error during the processing.
 */
const executeTakeHomeSolution = async () => {
  try {
    const [usersData, companiesData] = await readJSONData([
      USERS_FILE_PATH,
      COMPANIES_FILE_PATH,
    ]);

    processUserTokenTopUp(usersData, companiesData);
    const output = formatOutput(usersData, companiesData);
    await createOutputFile(output);
  } catch (err) {
    console.log("Error processing take-home solution:", err);
    throw err;
  }
};

executeTakeHomeSolution();
