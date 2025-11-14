import { context } from "./utils/context.ts";
import { initializeMainContext } from "./contexts/main.context.ts";
import { initializeHTTPServer } from "./5-http/server.ts";
import { setupAdminUser } from "./setup/admin.ts";

await initializeMainContext(context);
await setupAdminUser();
initializeHTTPServer();
