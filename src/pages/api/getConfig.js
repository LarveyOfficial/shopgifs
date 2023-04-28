import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "/src/data/config/");
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + "config.json", "utf8");
  //Return the content of the data file in json format
  const data = JSON.parse(fileContents);
  res.status(200).json(data);
}
