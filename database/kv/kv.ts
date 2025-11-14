export async function createKvClient(databasePath?: string): Promise<Deno.Kv> {
  const kvInstance = databasePath
    ? await Deno.openKv(databasePath)
    : await Deno.openKv();

  return kvInstance;
}

export function createInMemoryKvClient(): Promise<Deno.Kv> {
  return Deno.openKv(":memory:");
}
