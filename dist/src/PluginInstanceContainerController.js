"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PluginInstanceContainerController = void 0;
var path_1 = require("path");
var dotenv = __importStar(require("dotenv"));
var spawn_1 = require("./helpers/spawn");
var DockerodeHelper = require("@gluestack/helpers").DockerodeHelper;
var file_exists_1 = require("./helpers/file-exists");
var PluginInstanceContainerController = (function () {
    function PluginInstanceContainerController(app, callerInstance) {
        this.status = "down";
        this.app = app;
        this.callerInstance = callerInstance;
        this.setStatus(this.callerInstance.gluePluginStore.get("status"));
        this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
        this.setContainerId(this.callerInstance.gluePluginStore.get("container_id"));
    }
    PluginInstanceContainerController.prototype.getCallerInstance = function () {
        return this.callerInstance;
    };
    PluginInstanceContainerController.prototype.installScript = function () {
    };
    PluginInstanceContainerController.prototype.runScript = function () {
    };
    PluginInstanceContainerController.prototype.getEnv = function () {
        return {};
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var SSL_FILES_PATH, _a, _b, data, filesExist, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = path_1.join;
                        _b = [process.cwd()];
                        return [4, this.getSslFilesPath()];
                    case 1:
                        SSL_FILES_PATH = _a.apply(void 0, _b.concat([_e.sent()]));
                        data = {};
                        data.Image = "nginx:latest";
                        data.RestartPolicy = {
                            Name: "always"
                        };
                        data.HostConfig = {
                            PortBindings: {
                                "80/tcp": [{ HostPort: '80' }],
                                "443/tcp": [{ HostPort: '443' }]
                            }
                        };
                        return [4, (0, file_exists_1.fileExists)(SSL_FILES_PATH)];
                    case 2:
                        filesExist = _e.sent();
                        if (!filesExist) return [3, 4];
                        _c = data.HostConfig;
                        _d = "".concat;
                        return [4, this.getDefaultConfPath()];
                    case 3:
                        _c.Binds = [
                            _d.apply("", [_e.sent(), ":/etc/nginx/nginx.conf"]),
                            "".concat(SSL_FILES_PATH, "/fullchain.pem:/etc/ssl/fullchain.pem"),
                            "".concat(SSL_FILES_PATH, "/privkey.pem:/etc/ssl/privkey.pem")
                        ];
                        _e.label = 4;
                    case 4:
                        data.ExposedPorts = {
                            "80/tcp": {},
                            "443/tcp": {}
                        };
                        return [2, data];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getSslFilesPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var envPath, env;
            return __generator(this, function (_a) {
                envPath = (0, path_1.join)(process.cwd(), '.env');
                env = dotenv.config({ path: envPath }).parsed;
                return [2, env.SSL_CERTS];
            });
        });
    };
    PluginInstanceContainerController.prototype.getDefaultConfPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, (0, path_1.join)(process.cwd(), 'meta/router', 'nginx.conf')];
            });
        });
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function (returnDefault) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        if (_this.portNumber) {
                            return resolve(_this.portNumber);
                        }
                        var ports = _this.callerInstance
                            .callerPlugin
                            .gluePluginStore
                            .get("ports") || [];
                        DockerodeHelper.getPort(1337, ports)
                            .then(function (port) {
                            _this.setPortNumber(port);
                            ports.push(port);
                            _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                            return resolve(_this.portNumber);
                        })["catch"](function (e) {
                            reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstanceContainerController.prototype.getContainerId = function () {
        return this.containerId;
    };
    PluginInstanceContainerController.prototype.setStatus = function (status) {
        this.callerInstance.gluePluginStore.set("status", status || "down");
        this.status = status || "down";
        return this.status;
    };
    PluginInstanceContainerController.prototype.setPortNumber = function (portNumber) {
        this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
        this.portNumber = portNumber || null;
        return this.portNumber;
    };
    PluginInstanceContainerController.prototype.setContainerId = function (containerId) {
    };
    PluginInstanceContainerController.prototype.getConfig = function () { };
    PluginInstanceContainerController.prototype.up = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.getStatus() === "up")) return [3, 2];
                        return [4, this.down()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4, this.routeGenerate()];
                    case 3:
                        _a.sent();
                        return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b;
                                var _this = this;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _b = (_a = DockerodeHelper).up;
                                            return [4, this.getDockerJson()];
                                        case 1:
                                            _b.apply(_a, [_c.sent(), this.getEnv(),
                                                this.portNumber,
                                                this.callerInstance.getName()])
                                                .then(function (_a) {
                                                var status = _a.status, containerId = _a.containerId;
                                                return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_b) {
                                                        this.setStatus(status);
                                                        this.setContainerId(containerId);
                                                        return [2, resolve(true)];
                                                    });
                                                });
                                            })["catch"](function (e) {
                                                return reject(e);
                                            });
                                            return [2];
                                    }
                                });
                            }); })];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
                                    .then(function () {
                                    _this.setStatus("down");
                                    _this.setContainerId(null);
                                    return resolve(true);
                                })["catch"](function (e) {
                                    return reject(e);
                                });
                                return [2];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.watch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, []];
            });
        });
    };
    PluginInstanceContainerController.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.routeGenerate(true)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.routeGenerate = function (isProd) {
        if (isProd === void 0) { isProd = false; }
        return __awaiter(this, void 0, void 0, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            'glue',
                            'route:generate'
                        ];
                        if (isProd) {
                            args.push('--build');
                            args.push('prod');
                        }
                        return [4, (0, spawn_1.execute)('node', args, {
                                cwd: process.cwd(),
                                stdio: 'inherit',
                                shell: true
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return PluginInstanceContainerController;
}());
exports.PluginInstanceContainerController = PluginInstanceContainerController;
//# sourceMappingURL=PluginInstanceContainerController.js.map