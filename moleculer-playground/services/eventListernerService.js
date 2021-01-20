module.exports = {
  name: "eventListener",
  events: {
    "**"(payload, sender, event, ctx) {
      console.log(`Event '${event}' received from ${sender} node:`, payload);
    },
  },
};
