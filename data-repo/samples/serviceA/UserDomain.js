const { isEmpty } = require("lodash");
const BaseDomain = require("../base/BaseDomain");

class UserDomain extends BaseDomain {
  constructor(vorpal) {
    super();
    this.vorpal = vorpal;
    this._initCommand();
  }

  _initCommand() {
    const { vorpal } = this;
    const cmdName = "user";
    const props = ["name", "email"];
    this._vorpalCmds(vorpal, cmdName, props);
  }

  _vorpalCmds(vorpal, cmdName, props) {
    const self = this;

    vorpal.command(cmdName, `${cmdName} domain`).action(async function () {
      console.log("Please use");
      console.log(`\t user create`);
      console.log(`\t user update`);
      console.log(`\t user delete`);
      console.log(`\t user list`);
    });
    // Create
    vorpal
      .command(`${cmdName} create`, `create ${cmdName}`)
      .action(async function () {
        try {
          const obj = {
            _id: String(Date.now()),
          };
          for (const key of props) {
            const answer = await this.prompt({
              type: "input",
              name: key,
              message: `\t Properties ${key}: `,
            });
            obj[key] = answer[key];
          }
          self.create(obj);
          console.log("Added", { obj });
        } catch (error) {
          console.error(error.message);
        }
      });
    // Update
    let cmd = vorpal.command(`${cmdName} update <id>`);
    props.forEach((key) => cmd.option(`--${key} <${key}>`, key));
    cmd.action(async function (args) {
      try {
        const { options, id } = args;
        if (isEmpty(options)) return;
        const obj = {
          _id: id,
          ...options,
        };
        self.update(obj);
        console.log("Update", obj);
      } catch (error) {
        console.error(error.message);
      }
    });
    // Update
    vorpal.command(`${cmdName} delete <id>`).action(async function (args) {
      try {
        const { id } = args;
        const obj = { _id: id };
        self.delete(obj);
        console.log("Deleted", obj);
      } catch (error) {
        console.error(error.message);
      }
    });
    // List
    vorpal
      .command(`${cmdName} list [query]`, 'Example: list `{"name": "a"}`')
      .types({ string: "query" })
      .action(async function (args) {
        try {
          const { query = "{}" } = args;
          const res = await self.findAsync(JSON.parse(query));
          console.log(res);
        } catch (error) {
          console.error(error.message);
        }
      });
  }
}

module.exports = UserDomain;
