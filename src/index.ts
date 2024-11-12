import * as dotenv from "dotenv";

dotenv.config();

const runQuery = async (input: string) => {
  const result = await Promise.resolve(input);
  console.log(result);
};

runQuery("Hello");
