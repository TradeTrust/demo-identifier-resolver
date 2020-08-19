import middy from "middy";
import cors from "@middy/http-cors";
import httpSecurityHeaders from "@middy/http-security-headers";
import { withBoundary } from "../withBoundary";
import { withAuth } from "../withAuth";

export const restrictedRequestHandler = (handler: any) =>
  middy(handler)
    .use(cors({ cacheControl: "max-age=3600, s-maxage=3600, proxy-revalidate" }))
    .use(httpSecurityHeaders())
    .use(withAuth())
    .use(withBoundary());
