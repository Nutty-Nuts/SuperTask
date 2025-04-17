import { defineConfig } from "vitest/config";
import "dotenv/config";

let config;

if (process.env.TESTING_TYPE === "unit") {
  console.log("Setting up testing vitest configuration for unit testing...");
  console.warn(
    "Interaction between dependencies will not work in this configuration!",
  );
  config = defineConfig({
    test: {
      clearMocks: true,
      environment: "node",
      setupFiles: ["./src/singleton.js"],
      include: ["**/*.test.js"],
      exclude: ["**/*.integration.test.js"],
    },
  });
} else {
  console.log(
    "Setting up testing vitest configuration for integration testing...",
  );
  console.warn("Mocking will not work in this configuration!");
  config = defineConfig({
    test: {
      clearMocks: true,
      environment: "node",
      setupFiles: [],
      include: ["**/*.integration.test.js"],
    },
  });
}

export default config;
