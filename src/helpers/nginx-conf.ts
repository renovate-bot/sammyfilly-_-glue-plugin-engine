import { join } from 'path';
import { writeFileSync } from 'fs';
import { fileExists } from './file-exists';
import {
  endsWith, startsWith, setServer, setLocation
} from './nginx-literals';
import { createFolder } from './create-folder';
import { removeSpecialChars } from './remove-special-chars';

/**
 * Nginx Conf
 *
 * This class is responsible for generating the nginx.conf file
 * in your backend instance's engine/router folder.
 */
export default class NginxConf {
  public upstreams: any[];

  private filename: string = 'nginx.conf';
  private subdirectory: string = join('meta', 'router');
  private prodDir: string = 'prod';

  constructor() {
    this.upstreams = [];
  }

  // Generates the dev nginx.conf file
  public async generateDev(): Promise<void> {
    try {
      const conf: string = await this.toConf();
      const filepath: string = join(process.cwd(), this.subdirectory, this.filename);

      await createFolder(join(process.cwd(), this.subdirectory));
      writeFileSync(filepath, conf);

    } catch (err) {
      console.log('> NGINX file creation failed due to following reasons -');
      console.log(err);
    }
  }

  // Generates the prod nginx.conf file
  public async generateProd(): Promise<void> {
    try {
      const conf: string = await this.toProdConf();
      const filepath: string = join(process.cwd(), this.subdirectory,  this.prodDir, this.filename);

      await createFolder(join(process.cwd(), this.subdirectory, this.prodDir));
      writeFileSync(filepath, conf);

    } catch (err) {
      console.log('> NGINX file creation failed due to following reasons -');
      console.log(err);
    }
  }

  // Adds router.js data to the nginx conf data
  // if and only if the given path exists
  public async addRouter(packageName:string, instance: string, port: number, string: string): Promise<boolean> {
    const upstreams: any[] = this.upstreams;

    const exist = await fileExists(string);
    if (!exist) return Promise.resolve(false);

    upstreams.push({
      locations: [...require(string)()],
      port,
      instance: removeSpecialChars(instance),
      packageName});

    return Promise.resolve(true);
  }

  // Converts the nginx conf data to a string
  private async toConf(): Promise<string> {
    let content: string = '';
    const upstreams: any[] = this.upstreams;
    const mainStreams: any[] = [];

    // Add upstreams with server_name
    for await (const upstream of upstreams) {
      if (!await this.hasServerName(upstream.locations)) {
        mainStreams.push({locations: [...upstream.locations], port: upstream.port});
        continue;
      }

      let locations: string[] = [];
      let server_name: string = '';

      for await (const location of upstream.locations) {
        if (location.hasOwnProperty('server_name') && location.server_name !== '') {
          server_name = location.server_name;
        }

        if (location.hasOwnProperty('path')) {
          locations.push(setLocation(
            location.path, `host.docker.internal:${upstream.port}`, location.proxy.path, location.host, location.size_in_mb || 50
          ));
        }
      }

      content += setServer(`${server_name}.local.gluestack.app`, locations);
    }

    // Add upstreams without server_name into project name as server_name
    const locations: string[] = [];
    for await (const mainStream of mainStreams) {
      for await (const location of mainStream.locations) {
        if (location.hasOwnProperty('path')) {
          locations.push(setLocation(
            location.path, `host.docker.internal:${mainStream.port}`, location.proxy.path, location.host, location.size_in_mb || 50
          ));
        }
      }
    }

    if (locations.length > 0) {
      const server_name: string = process
        .cwd().split('/')[process.cwd().split('/').length - 1];

      content += setServer(`${server_name}.local.gluestack.app`, locations);
    }

    return Promise.resolve(startsWith + content + endsWith);
  }

  // Converts the nginx conf data to a string
  private async toProdConf(): Promise<string> {
    let content: string = '';
    const upstreams: any[] = this.upstreams;
    const mainStreams: any[] = [];

    // Add upstreams with server_name
    for await (const upstream of upstreams) {
      if (!await this.hasServerName(upstream.locations)) {
        mainStreams.push({
          locations: [...upstream.locations],
          port: upstream.port,
          packageName: upstream.packageName,
          instance: upstream.instance
        });
        continue;
      }

      let locations: string[] = [];
      let server_name: string = '';

      for await (const location of upstream.locations) {
        if (location.hasOwnProperty('server_name') && location.server_name !== '') {
          server_name = location.server_name;
        }

        const port: any = upstream.packageName === '@gluestack/glue-plugin-web' ? 3000 : upstream.port;
        if (location.hasOwnProperty('path')) {
          locations.push(setLocation(
            location.path, `${upstream.instance}:${port}`, location.proxy.path, location.host, location.size_in_mb || 50
          ));
        }
      }

      content += setServer(`${server_name}.local.gluestack.app`, locations);
    }

    // Add upstreams without server_name into project name as server_name
    const locations: string[] = [];
    for await (const mainStream of mainStreams) {
      if (mainStream.packageName === '@gluestack/glue-plugin-backend-engine') {
        continue;
      }

      for await (const location of mainStream.locations) {
        const port: any = mainStream.packageName === '@gluestack/glue-plugin-web' ? 3000 : mainStream.port;
        if (location.hasOwnProperty('path')) {
          locations.push(setLocation(
            location.path, `${mainStream.instance}:${port}`, location.proxy.path, location.host, location.size_in_mb || 50
          ));
        }
      }
    }

    if (locations.length > 0) {
      const server_name: string = process
        .cwd().split('/')[process.cwd().split('/').length - 1];

      content += setServer(`${server_name}.local.gluestack.app`, locations, true);
    }

    return Promise.resolve(startsWith + content + endsWith);
  }

  // Checks if the given router (Array of Nginx Objects) has a server_name
  private async hasServerName(router: any[]) {
    for await (const route of router) {
      if (route.hasOwnProperty("server_name") && route.server_name !== '') {
        return true;
      }
    }
    return false;
  }
}
