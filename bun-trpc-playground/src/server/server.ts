import z from "zod";
import { initTRPC, tracked } from "@trpc/server";
import { WebSocketServer } from "ws";
import {
  createHTTPServer,
  type CreateHTTPContextOptions,
} from "@trpc/server/adapters/standalone";
import {
  applyWSSHandler,
  type CreateWSSContextFnOptions,
} from "@trpc/server/adapters/ws";
import { EventEmitter, on } from "events";
import { randomUUID } from "node:crypto";

// This is how you initialize a context for the server
function createContext(
  opts: CreateHTTPContextOptions | CreateWSSContextFnOptions
) {
  const uuid = randomUUID();
  return {
    uuid,
    info: opts.info,
    req: opts.req,
  };
}
type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
const router = t.router;
const publicProcedure = t.procedure;

const generalRoute = createGeneralRoute();
const counterRoute = createCounterRoute();

const appRouter = router({
  general: generalRoute,
  counter: counterRoute,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

// ------------------------------------------------------------------------------------------------------------------------
// Route layers
// ------------------------------------------------------------------------------------------------------------------------

function createGeneralRoute() {
  const healthCheck = publicProcedure.query(async (opts) => {
    const userAgent = opts.ctx.req.headers["user-agent"];
    return `ok - userAgent=${userAgent}`;
  });

  const doRandom = publicProcedure.query(async (opts) => {
    return Math.random();
  });

  const generalRoute = t.router({
    healthCheck,
    doRandom,
  });
  return generalRoute;
}

function createCounterRoute() {
  const counterGlobalState = {
    counter: 0,
    ee: new EventEmitter<{
      updated: [number];
    }>(),

    doUpdate: function (val: number) {
      this.counter += val;
      this.ee.emit("updated", this.counter);
    },
  };

  setInterval(() => {
    counterGlobalState.doUpdate(Math.round(Math.random() * 10));
  }, 10000);

  const get = publicProcedure.query(async () => {
    return counterGlobalState.counter;
  });

  const inc = publicProcedure
    .input(z.object({ val: z.number() }))
    .mutation(async (opts) => {
      counterGlobalState.doUpdate(opts.input.val);
      return counterGlobalState.counter;
    });

  const sub = publicProcedure.subscription(async function* (opts) {
    try {
      console.log("counter sub started", opts.ctx.uuid);
      const src = on(counterGlobalState.ee, "updated");

      const signal = opts.signal;
      if (signal) {
        signal.onabort = () => {
          console.log(`aborted`, opts.ctx.uuid);
          src.return && src.return(null);
        };
      }

      for await (const [itm] of src) {
        // tracking the post id ensures the client can reconnect at any time and get the latest events this id
        yield tracked("counter_val", itm);
      }
    } catch (error) {
    } finally {
      console.log("counter sub end", opts.ctx.uuid);
    }
  });

  const counterRoute = t.router({
    get,
    inc,
    sub,
  });
  return counterRoute;
}

// ------------------------------------------------------------------------------------------------------------------------
// Serve layers
// ------------------------------------------------------------------------------------------------------------------------

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

// ws server
const wss = new WebSocketServer({ server });
applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext,
});

server.listen(3000);
console.log("http server start at http://localhost:3000");
