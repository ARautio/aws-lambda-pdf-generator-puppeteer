import * as pug from "pug";
import { knex } from "./db";

export const generateTemplate = async (
  year: number,
  month: number,
  isOffline: boolean
) => {
  const selDate = new Date(year, month);
  const filter = {
    month: selDate.toLocaleString("en", { month: "long" }),
    year: selDate.getFullYear(),
  };
  try {
    // Fetch data with knex
    const result = !isOffline
      ? await knex
          .select()
          .from("sales")
          .where({
            year: filter.year,
            month: selDate.getMonth() + 1,
          })
      : [];

    const template = pug.compileFile("./src/template.pug");
    return template({ ...filter, result });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
    return "";
  }
};
