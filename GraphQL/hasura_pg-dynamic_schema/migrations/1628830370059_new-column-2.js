/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (input) => {
  /**
   * @type {import('node-pg-migrate').MigrationBuilder}
   */
  const pgm = input;
  pgm.addColumns("rows", {
    hpulse: { type: "float" },
  });
};

exports.down = (input) => {
  /**
   * @type {import('node-pg-migrate').MigrationBuilder}
   */
  const pgm = input;
  pgm.dropColumns("rows", ["hpulse"]);
};
