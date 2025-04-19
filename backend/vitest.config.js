import { defineConfig } from "vitest/config";
import "dotenv/config";

let config;

console.log(`TESTING_TYPE=${process.env.TESTING_TYPE}`);

if (process.env.TESTING_TYPE === "unit") {
  console.log("Setting up testing vitest configuration for unit testing...");
  console.warn(
    "Interaction between dependencies will not work in this configuration!",
  );
  config = defineConfig({
    test: {
      clearMocks: true,
      environment: "node",
      setupFiles: ["./singleton.js"],
      include: ["**/*.test.js"],
      exclude: [
        "**/*.integration.test.js",
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      ],
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
