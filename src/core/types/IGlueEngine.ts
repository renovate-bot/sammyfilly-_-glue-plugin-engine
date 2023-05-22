import { IStatelessPlugin } from "./IStatelessPlugin";

export interface IGlueEngine {
  statelessPlugins: IStatelessPlugin[];

  collectPlugins(): Promise<void>;

  start(isRun?: boolean): Promise<void>;
  update(): Promise<void>;
  stop(isRun?: boolean): Promise<void>;

  startDockerCompose(): Promise<void>;
  stopDockerCompose(): Promise<void>;

  createDockerCompose(): Promise<void>;
}
