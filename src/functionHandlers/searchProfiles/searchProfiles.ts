import { APIGatewayEvent } from "aws-lambda";
import createHttpError from "http-errors";
import { restrictedRequestHandler } from "../../middlewares/handlers";
import { sheetsToJson } from "../../services/sheets";
import { config } from "../../config";
import { memoize } from "../../common/utils";

interface Identity {
  name: string;
  remarks: string;
  identifier: string;
}

interface Identities {
  [identifier: string]: Identity;
}

const searchProfiles = async (event: APIGatewayEvent) => {
  const query = event.queryStringParameters?.q;
  if (!query) throw new createHttpError.BadRequest("Query string is not defined");
  if (query.length < 3) throw new createHttpError.BadRequest("Query string needs to be at least 3 characters");

  const lowercaseQuery = query.toLowerCase();

  const allResults = await memoize(
    () =>
      sheetsToJson<Identities>({
        id: config.sheetsId,
        range: config.sheetsRange,
        keyBy: "identifier"
      }),
    "IDENTITIES"
  );

  const identities = Object.keys(allResults)
    .map(address => allResults[address])
    .filter(
      identity =>
        identity.name.toLowerCase().includes(lowercaseQuery) ||
        identity.remarks.toLowerCase().includes(lowercaseQuery) ||
        identity.identifier.toLowerCase().includes(lowercaseQuery)
    );

  return { identities };
};

export const handler = restrictedRequestHandler(searchProfiles);
