/**
 *
 * @param {import('knex')} knex
 */
exports.up = async function (knex) {
  await knex.schema
    .withSchema("public")
    .createTable("users", (table) => {
      table
        .uuid("id")
        .primary()
        .nullable()
        .defaultTo(knex.raw("public.gen_random_uuid()"));
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("avatar_url");
      table.string("first_name");
      table.string("last_name");
      table.timestamps(true, true);
    })
    .then();

  await knex.schema
    .withSchema("public")
    .createTable("posts", (table) => {
      table.uuid("id").defaultTo(knex.raw("public.gen_random_uuid()"));
      table.uuid("user_id").references("id").inTable("users");
      table.string("content");
      table.timestamps(true, true);
    })
    .then();

  await knex.schema
    .withSchema("public")
    .createTable("follows", (table) => {
      table.uuid("user_id").references("id").inTable("users");
      table.uuid("follower_id").references("id").inTable("users");
      table.timestamps(true, true);
    })
    .then();
};

/**
 *
 * @param {import('knex')} knex
 */
exports.down = async function (knex) {
  await knex.schema.withSchema("public").dropTable("posts").then();
  await knex.schema.withSchema("public").dropTable("follows").then();
  await knex.schema.withSchema("public").dropTable("users").then();
};
