import * as dotenv from "dotenv";

dotenv.config();

const run = async (input: string) => {
  await Promise.resolve();
  console.log("Hello from async typescript: ", input);
};

run("Hello, what museums can I visit?");
