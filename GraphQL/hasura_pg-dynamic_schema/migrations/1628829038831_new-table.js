/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (input) => {
  /**
   * @type {import('node-pg-migrate').MigrationBuilder}
   */
  const pgm = input;
  pgm.createTable("rows", {
    id: "id",
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

exports.down = (input) => {
  /**
   * @type {import('node-pg-migrate').MigrationBuilder}
   */
  const pgm = input;
  pgm.dropTable("rows");
};
