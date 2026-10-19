import { spawn } from "node:child_process";

const env = {
  ...process.env,
  TOKIO_WORKER_THREADS: "1",
  RAYON_NUM_THREADS: "1",
};

const child = spawn("npx", ["next", "build"], {
  stdio: "inherit",
  env,
  shell: true,
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`next build exited from signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
