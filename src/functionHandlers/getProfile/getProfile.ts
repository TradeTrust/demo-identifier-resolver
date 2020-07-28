import { APIGatewayEvent } from "aws-lambda";
import createHttpError from "http-errors";
import { publicRequestHandler } from "../../middlewares/handlers";
import { sheetsToJson } from "../../services/sheets";
import { config } from "../../config";
import { memoize } from "../../common/utils";

interface Identity {
  name: string;
}

interface Identities {
  [identifier: string]: Identity;
}

const getIdentifier = async (event: APIGatewayEvent) => {
  const { id } = event.pathParameters ?? { id: undefined };
  if (!id) {
    throw new createHttpError.BadRequest("Identifier is not provided");
  }

  const apiKey =
    event.headers["x-api-key"] ||
    event.headers.Authorization ||
    event.headers["api-key"] ||
    event.headers.apikey ||
    config.sheetsApiKey;

  if (!apiKey) {
    throw new Error("API key is not provided");
  }

  const identities = await memoize(
    () =>
      sheetsToJson<Identities>({
        sheetsApiKey: apiKey,
        id: config.sheetsId,
        range: config.sheetsRange,
        keyBy: "identifier"
      }),
    "IDENTITIES"
  );
  const identity = identities[id.toLowerCase()];
  if (!identity) {
    throw new createHttpError.NotFound(`No profile found for ${id}`);
  }

  return { identity };
};

export const handler = publicRequestHandler(getIdentifier);
