import { google } from "googleapis";
import { zipObject } from "lodash";
import { config } from "../../config";

const sheets = google.sheets("v4");

export async function sheetsToJson<T>({ id, range, keyBy }: { id: string; range: string; keyBy: string }) {
  const { data } = await sheets.spreadsheets.values.get({
    auth: config.sheetsApiKey,
    spreadsheetId: id,
    range
  });
  const { values } = data;
  if (!values) throw new Error("No data found");
  const header = values.shift();
  if (!header) throw new Error("No headers found");
  const json = values.reduce((prev, curr) => {
    const row = zipObject(header, curr);
    return { ...prev, [row[keyBy]]: row };
  }, {} as T);
  return json;
}
