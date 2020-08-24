import { restrictedRequestHandler } from "../../middlewares/handlers";

const features = {
  addressResolution: {
    location: "/identifier"
  },
  entityLookup: {
    location: "/search"
  },
  version: 1
};

const getFeatures = async () => {
  return { features };
};

export const handler = restrictedRequestHandler(getFeatures);
