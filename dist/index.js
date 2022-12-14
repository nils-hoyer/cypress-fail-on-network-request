"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequestExcluded = exports.findRequest = exports.mapToRequests = exports.createConfig = exports.validateConfig = void 0;
var chai = __importStar(require("chai"));
var chai_1 = require("chai");
var os_1 = require("os");
var type_detect_1 = __importDefault(require("type-detect"));
function failOnNetworkRequest(_config) {
    var _this = this;
    if (_config === void 0) { _config = {}; }
    var config;
    var originConfig;
    var requests = [];
    var getRequests = function () { return requests; };
    var getConfig = function () { return config; };
    var setConfig = function (_config) {
        (0, exports.validateConfig)(_config);
        config = (0, exports.createConfig)(_config);
        originConfig = originConfig !== null && originConfig !== void 0 ? originConfig : __assign({}, config);
    };
    var waitForRequests = function (timeout) {
        if (timeout === void 0) { timeout = 10000; }
        var requestsDone = function () {
            return getRequests().every(function (request) { return request.status !== undefined; });
        };
        return cy.wrap(waitUntil(requestsDone, timeout), {
            timeout: timeout + 100,
        });
    };
    setConfig(_config);
    Cypress.on('request:event', function (eventName, event) {
        var subscribedEvents = [
            'incoming:request',
            'request:error',
            'response:received',
        ];
        var unknownResponse = eventName === 'response:received' &&
            (0, exports.findRequest)(requests, event.requestId) === undefined;
        if (!subscribedEvents || unknownResponse)
            return;
        if (eventName === 'incoming:request') {
            requests.push({
                requestId: event.requestId,
                method: event.method,
                url: event.url,
                status: undefined,
            });
            return;
        }
        requests = requests.map(function (request) {
            if (request.requestId !== event.requestId)
                return request;
            return __assign(__assign({}, request), { status: event.status });
        });
        if (!(0, exports.isRequestExcluded)((0, exports.findRequest)(requests, event.requestId), getConfig())) {
            throw new chai_1.AssertionError("cypress-fail-on-network-request: ".concat(os_1.EOL, " ").concat(JSON.stringify(requests)));
        }
    });
    Cypress.on('test:after:run', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setConfig(originConfig);
            requests = [];
            return [2 /*return*/];
        });
    }); });
    return {
        getConfig: getConfig,
        setConfig: setConfig,
        waitForRequests: waitForRequests,
    };
}
exports.default = failOnNetworkRequest;
var validateConfig = function (config) {
    var _a;
    // TODO replace any with Request
    (_a = config.requests) === null || _a === void 0 ? void 0 : _a.forEach(function (request) {
        if ((0, type_detect_1.default)(request) === 'string')
            return;
        chai.expect((0, type_detect_1.default)(request.url)).to.be.oneOf([
            'string',
            'RegExp',
            'undefined',
        ]);
        chai.expect((0, type_detect_1.default)(request.method)).to.be.oneOf([
            'string',
            'undefined',
        ]);
        chai.expect((0, type_detect_1.default)(request.status)).to.be.oneOf([
            'Object',
            'number',
            'undefined',
        ]);
        if ((0, type_detect_1.default)(request.status) === 'Object') {
            chai.expect((0, type_detect_1.default)(request.status.from)).to.equal('number');
            chai.expect((0, type_detect_1.default)(request.status.to)).to.equal('number');
        }
    });
};
exports.validateConfig = validateConfig;
//TODO: use Request[] instead of any
var createConfig = function (config) {
    return {
        requests: config.requests !== undefined ? (0, exports.mapToRequests)(config.requests) : [],
    };
};
exports.createConfig = createConfig;
var mapToRequests = function (_unknowns) {
    return _unknowns.map(function (unknown) {
        if (typeof unknown !== 'string') {
            var status_1 = undefined;
            if (unknown.status !== undefined) {
                status_1 =
                    (0, type_detect_1.default)(unknown.status) === 'number'
                        ? { from: unknown.status, to: unknown.status }
                        : {
                            from: unknown.status.from,
                            to: unknown.status.to,
                        };
            }
            return {
                url: unknown.url,
                method: unknown.method,
                status: status_1,
            };
        }
        return {
            url: unknown,
            method: undefined,
            status: undefined,
        };
    });
};
exports.mapToRequests = mapToRequests;
var findRequest = function (requests, eventRequestId) {
    return requests.find(function (request) { return request.requestId === eventRequestId; });
};
exports.findRequest = findRequest;
var isRequestExcluded = function (request, config) {
    var _a;
    //TODO: replace any with Request
    return (_a = config.requests) === null || _a === void 0 ? void 0 : _a.some(function (configRequest) {
        var urlMatch = configRequest.url
            ? new RegExp(configRequest.url).test(request.url)
            : true;
        var statusMatch = configRequest.status
            ? configRequest.status.from >= request.status &&
                configRequest.status.to <= request.status
            : true;
        var methodMatch = (configRequest === null || configRequest === void 0 ? void 0 : configRequest.method)
            ? (configRequest === null || configRequest === void 0 ? void 0 : configRequest.method) === request.method
            : true;
        return urlMatch && statusMatch && methodMatch;
    });
};
exports.isRequestExcluded = isRequestExcluded;
var waitUntil = function (predicate, timeout) {
    var startTime = new Date().getTime();
    var isTimeUp = function (startTime, timeout) {
        return new Date().getTime() > startTime + timeout;
    };
    var poll = function (resolve) {
        if (predicate() || isTimeUp(startTime, timeout)) {
            resolve();
        }
        else {
            setTimeout(function () { return poll(resolve); }, 500);
        }
    };
    return new Cypress.Promise(poll);
};
