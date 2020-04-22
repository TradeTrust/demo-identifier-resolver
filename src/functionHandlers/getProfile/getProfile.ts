import { APIGatewayEvent } from "aws-lambda";
import createHttpError from "http-errors";
import { publicRequestHandler } from "../../middlewares/handlers";

interface Identity {
  name: string;
}

interface Identities {
  [identifier: string]: Identity;
}

const identities: Identities = {
  "0x0103e04ecaa67c4e5a8c6dc1ddda35340e2c6bc8": {
    name: "ABC Pte Ltd"
  }
};

const getIdentifier = async (event: APIGatewayEvent) => {
  const { id } = event.pathParameters ?? { id: undefined };
  if (!id) {
    throw new createHttpError.BadRequest("Identifier is not provided");
  }
  const identity = identities[id];
  if (!identity) {
    throw new createHttpError.NotFound(`No profile found for ${id}`);
  }

  return { identity };
};

export const handler = publicRequestHandler(getIdentifier);
