const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    video: true,
    videoFolder: "cypress/videos",
    setupNodeEvents(on, config) { },
  },
});
