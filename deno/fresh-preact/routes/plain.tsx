import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    return new Response("Hello World");
  },
};
