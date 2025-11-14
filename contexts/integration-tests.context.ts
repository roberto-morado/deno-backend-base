import { createKvClient } from "../database/kv/kv.ts";
import { UserKvRepository } from "../database/kv/repositories/user.repository.ts";
import { Context } from "@dest/context.ts";

export async function initializeIntegrationTestsContext(context: Context) {
  const kvClient = await createKvClient();
  context.bind("kv-client", kvClient);

  context.bind("user-repository", UserKvRepository);
}
