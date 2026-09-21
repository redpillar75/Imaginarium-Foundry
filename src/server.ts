import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Imaginarium Foundry Instagram Saves Engine listening on port ${env.PORT}`);
});
