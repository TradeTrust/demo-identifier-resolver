import { APIGatewayEvent } from "aws-lambda";
import createHttpError from "http-errors";
import { restrictedRequestHandler } from "../../middlewares/handlers";
import { sheetsToJson } from "../../services/sheets";
import { config } from "../../config";
import { memoize } from "../../common/utils";

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 1000;

interface Identity {
  name: string;
  source: string;
  remarks: string;
  identifier: string;
}

interface Identities {
  [identifier: string]: Identity;
}

interface QueryParameters {
  q?: string;
  limit?: string;
  offset?: string;
}

const searchProfiles = async (event: APIGatewayEvent) => {
  if (!event.queryStringParameters) throw new createHttpError.BadRequest("No query string parameters provided");
  const { q: query, limit: limitStr, offset: offsetStr } = event.queryStringParameters as QueryParameters;
  if (!query) throw new createHttpError.BadRequest("Query string is not defined");
  if (query.length < 3) throw new createHttpError.BadRequest("Query string needs to be at least 3 characters");

  const limit = limitStr && !Number.isNaN(Number(limitStr)) ? Number(limitStr) : DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) throw new createHttpError.BadRequest(`Max page size exceeds ${MAX_LIMIT}`);
  const offset = offsetStr && !Number.isNaN(Number(offsetStr)) ? Number(offsetStr) : DEFAULT_OFFSET;

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

  const isQueryMatch = (field: string | undefined, queryText: string) => {
    if (!field) return false; // skip if google sheet cell is undefined
    return field.toLowerCase().includes(queryText);
  };

  const identities = Object.keys(allResults)
    .map(address => allResults[address])
    .filter(
      identity =>
        isQueryMatch(identity.name, lowercaseQuery) ||
        isQueryMatch(identity.remarks, lowercaseQuery) ||
        isQueryMatch(identity.source, lowercaseQuery) ||
        isQueryMatch(identity.identifier, lowercaseQuery)
    );
  const pagedResults = identities.splice(offset, limit);

  return { identities: pagedResults };
};

export const handler = restrictedRequestHandler(searchProfiles);
