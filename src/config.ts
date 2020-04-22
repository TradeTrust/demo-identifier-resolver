const generateConfig = () => ({
  sheetsApiKey: process.env.SHEETS_API_KEY || "",
  sheetsId: process.env.SHEETS_ID || "",
  sheetsRange: process.env.SHEETS_RANGE || ""
});

export const config = generateConfig();
