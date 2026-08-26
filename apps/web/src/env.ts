import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.url().default("http://localhost:3001"),
  },

  runtimeEnv: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  },

  emptyStringAsUndefined: true,
});
