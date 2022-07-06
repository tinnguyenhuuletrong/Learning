/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "../utils/twind.ts";

const NAMES = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"];

interface Data {
  results: string[];
  query: string;
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const results = NAMES.filter((name) => name.includes(query));
    return ctx.render({ results, query });
  },
};

export default function Page({ data }: PageProps<Data>) {
  const { results, query } = data;

  return (
    <div
      class={tw`p-4 mx-auto my-10 max-w-screen-md min-h-[30vh] bg-purple-100 rounded-lg flex flex-col items-center justify-center`}
    >
      <form>
        <label class="relative block">
          <input
            class="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            placeholder="Search for anything..."
            type="text"
            name="q"
            value={query}
          />
          <button class={tw`ml-2`} type="submit">
            Search
          </button>
        </label>
      </form>
      <ul>
        {results.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
