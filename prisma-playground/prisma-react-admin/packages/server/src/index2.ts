import path from "path";
import * as HTTP from "http";
import { addCrudResolvers } from "@ra-data-prisma/backend";
import { asNexusMethod, makeSchema, objectType } from "@nexus/schema";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import { DateTimeResolver, JSONObjectResolver } from "graphql-scalars";
import { ApolloServer } from "apollo-server-express";
import express from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const UserObj = objectType({
  name: "User",
  definition(t: any) {
    t.model.id();
    t.model.email();
    t.model.birthDate();
    t.model.posts();
  },
});
const PostObj = objectType({
  name: "Post",
  definition(t: any) {
    t.model.id();
    t.model.authors();
  },
});

const plugin: any = nexusSchemaPrisma({
  experimentalCRUD: true, // required!
  paginationStrategy: "prisma", // required!
});

const schema = makeSchema({
  types: [
    asNexusMethod(JSONObjectResolver, "json"),
    asNexusMethod(DateTimeResolver, "date"),
    UserObj,
    PostObj,
    addCrudResolvers("User"), // 👈 this will expose all required Query's and Mutation's.
    addCrudResolvers("Post"), // 👈 this will expose all required Query's and Mutation's.
  ],
  plugins: [plugin],
  outputs: {
    typegen: path.join(
      __dirname,
      "../node_modules/@types/typegen-nexus/index.d.ts"
    ),
    schema: path.join(__dirname, "./schema.graphql"),
  },
});

const apollo = new ApolloServer({
  context: () => ({ prisma }),
  schema,
});
const app = express();
const http = HTTP.createServer(app);

apollo.applyMiddleware({ app });
apollo.installSubscriptionHandlers(http);

http.listen(4000, () => {
  console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`);
});
