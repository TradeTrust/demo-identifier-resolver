import createHttpError from "http-errors";
import { withBoundary } from "./withBoundary";

const context = { awsRequestId: "request-id" };

describe("withBoundary", () => {
  describe("after", () => {
    it("should return data from handler correctly", async () => {
      const handler = { response: { foo: "bar" } } as any;
      await withBoundary().after(handler, undefined as any);
      expect(handler).toEqual({
        response: {
          statusCode: 200,
          body: `{"foo":"bar"}`,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": false
          }
        }
      });
    });

    it("should return generic message if handler did not return data", async () => {
      const handler = { response: undefined } as any;
      await withBoundary().after(handler, undefined as any);
      expect(handler).toEqual({
        response: {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": false
          }
        }
      });
    });
  });

  describe("onError", () => {
    it("should return correct error codes for unexpected errors", async () => {
      const handler = { error: new Error("Boom!"), context } as any;
      await withBoundary().onError(handler, undefined as any);
      expect(handler.response).toEqual({
        statusCode: 500,
        body: `{"requestId":"request-id"}`,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": false
        }
      });
    });

    it("should return correct error codes for expected errors", async () => {
      const handler = { error: createHttpError(500, "Boom!"), context } as any;
      await withBoundary().onError(handler, undefined as any);
      expect(handler.response).toEqual({
        statusCode: 500,
        body: `{"requestId":"request-id"}`,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": false
        }
      });
    });

    it("should return correct error codes for exposed expected errors", async () => {
      const handler = { error: createHttpError(400, "Boom!"), context } as any;
      await withBoundary().onError(handler, undefined as any);
      expect(handler.response).toEqual({
        statusCode: 400,
        body: `{"requestId":"request-id","message":"Boom!"}`,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": false
        }
      });
    });
  });
});
