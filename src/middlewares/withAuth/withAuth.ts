/* eslint-disable no-param-reassign */
import { MiddlewareObject, MiddlewareFunction } from "middy";
import createHttpError from "http-errors";

interface OnlyAuthorizedOperatorSessionMiddleware<T, R> extends MiddlewareObject<T, R> {
  before: MiddlewareFunction<T, R>;
}

export const withAuth = (): OnlyAuthorizedOperatorSessionMiddleware<any, any> => ({
  before: async ({ event }) => {
    const apiKey = event.headers["x-api-key"];

    if (!apiKey) {
      throw new createHttpError.BadRequest("API key is not provided");
    }

    if (apiKey !== "DEMO") {
      throw new createHttpError.BadRequest("API key provided is not valid");
    }
  }
});
