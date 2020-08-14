import { withAuth } from "./withAuth";

describe("withAuth", () => {
  describe("before", () => {
    it("should pass with correct api key", async () => {
      const handler = { event: { headers: { "x-api-key": "DEMO" } } } as any;
      await expect(withAuth().before(handler, undefined as any)).resolves.not.toThrow();
    });

    it("should throw with incorrect api key", async () => {
      const handler = { event: { headers: { "x-api-key": "FOO" } } } as any;
      await expect(withAuth().before(handler, undefined as any)).rejects.toThrow(/API key provided is not valid/);
    });

    it("should throw with missing api key", async () => {
      const handler = { event: { headers: {} } } as any;
      await expect(withAuth().before(handler, undefined as any)).rejects.toThrow(/API key is not provided/);
    });
  });
});
