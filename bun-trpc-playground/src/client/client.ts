import {
  createTRPCClient,
  createWSClient,
  httpLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import type { AppRouter } from "../server/server";

const wsClient = createWSClient({
  url: `ws://localhost:3000`,
});
const trpc = createTRPCClient<AppRouter>({
  links: [
    // call subscriptions through websockets and the rest over http
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpLink({
        url: `http://localhost:3000`,
      }),
    }),
  ],
});

const healthCheckRes = await trpc.general.healthCheck.query();
console.log("trpc.general.healthCheck.query -> ", healthCheckRes);

const randomRes = await trpc.general.doRandom.query();
console.log("trpc.general.randomRes.query -> ", randomRes);

const sub = trpc.counter.sub.subscribe(undefined, {
  onData: (val) => {
    console.log("onCounterUpdated: ", val);
  },
  onError: (err) => {
    console.error("error", err.message);
  },
});

setInterval(async () => {
  const val = Math.round(Math.random() * 1000);
  try {
    const res = await trpc.counter.inc.mutate({ val: 99 });
    console.log(`trpc.counter.inc.mutate(${val}) -> `, res);
  } catch (error: any) {
    console.error(`trpc.counter.inc.mutate(${val}) -> error `, error?.message);
  }
}, 3000);

// wsClient.close();
// console.log("bye!");
