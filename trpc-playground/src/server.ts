import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import express from "express";

const t = initTRPC.create();

interface User {
  id: string;
  name: string;
}

const userList: User[] = [
  {
    id: "1",
    name: "KATT",
  },
];

const appRouter = t.router({
  listUsers: t.procedure.query((req) => {
    return userList;
  }),
  userById: t.procedure.input(z.string().min(1)).query((req) => {
    const input = req.input;
    const user = userList.find((u) => u.id === input);

    return user;
  }),
  userCreate: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation((req) => {
      const id = `${Date.now()}`;

      const user: User = {
        id,
        name: req.input.name,
      };

      userList.push(user);

      return user;
    }),
});

export type AppRouter = typeof appRouter;

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

const app = express();
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.listen(4000);
console.log("server started at http://localhost:4000");
