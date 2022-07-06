/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const resp = await ctx.render();
    resp.headers.set("X-Custom-Header", "Hello World");
    return resp;
  },
};

export default function Page(props: PageProps) {
  return (
    <div
      class={tw`p-4 mx-auto my-10 max-w-screen-md min-h-[30vh] bg-purple-100 rounded-lg flex items-center justify-center`}
    >
      You are on the page '{props.url.href}'.
    </div>
  );
}
