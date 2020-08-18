import middy from "middy";
import { cors } from "middy/middlewares";
import httpSecurityHeaders from "@middy/http-security-headers";
import { withBoundary } from "../withBoundary";
import { withAuth } from "../withAuth";

export const restrictedRequestHandler = (handler: any) =>
  middy(handler)
    .use(cors({ headers: "Access-Control-Allow-Headers" }))
    .use(httpSecurityHeaders())
    .use(withAuth())
    .use(withBoundary());
