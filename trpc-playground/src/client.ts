import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./server";
import fetch from "node-fetch";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
      fetch,
    }),
  ],
});

async function main() {
  const user = await trpc.userById.query("1");
  console.log("query userById", "1", "->", user);

  const newUser = await trpc.userCreate.mutate({ name: "new_user" });
  console.log("new user ", newUser);

  const allUsers = await trpc.listUsers.query();
  console.log("allUsers ", allUsers);
}

main();
