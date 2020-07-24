import { google } from "googleapis";
import { zipObject } from "lodash";

const sheets = google.sheets("v4");

export async function sheetsToJson<T>({
  sheetsApiKey,
  id,
  range,
  keyBy
}: {
  sheetsApiKey: string;
  id: string;
  range: string;
  keyBy: string;
}) {
  const { data } = await sheets.spreadsheets.values.get({
    auth: sheetsApiKey,
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
