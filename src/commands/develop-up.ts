import { GlueStackPlugin } from "src";
import GluestackEngine from "../core/GluestackEngine";
import { IGlueEngine } from "../core/types/IGlueEngine";
import IApp from "@gluestack/framework/types/app/interface/IApp";

export function developUp(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("develop:up")
    .option("--no-cache", "build docker with --no-cache")
    .description(
      "Starts all the containers for the project.",
    )
    .action((args: any) => runner(glueStackPlugin, args));
}

export async function runner(
  glueStackPlugin: GlueStackPlugin,
  args: any
) {
  const app: IApp = glueStackPlugin.app;
  try {
    const noCache = args.cache === false ? true : false;
    const engine: IGlueEngine = new GluestackEngine(app, 'backend');

    if (noCache) {
      await engine.startDockerComposeBuild();
    }

    await engine.start();
  } catch (err) {
    console.log('>> err', err);
  }
}
