"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEnvoiInbound = handleEnvoiInbound;
exports.verifyEnvoiSignature = verifyEnvoiSignature;
var fs = require("fs");
var path = require("path");
var axios_1 = require("axios");
var crypto = require("crypto");
var hedraService_1 = require("./hedraService");
var LOG_DIR = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(LOG_DIR))
    fs.mkdirSync(LOG_DIR, { recursive: true });
function handleEnvoiInbound(event) {
    return __awaiter(this, void 0, void 0, function () {
        var logLine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Basic validation of required fields
                    if (!event || !event.eventName) {
                        throw new Error('Invalid Envoi event: missing eventName');
                    }
                    logLine = "".concat(new Date().toISOString(), " | ").concat(event.eventName, " | ").concat(JSON.stringify(event), "\n");
                    fs.appendFileSync(path.join(LOG_DIR, 'envoi-events.log'), logLine);
                    _a = event.eventName;
                    switch (_a) {
                        case 'PredictionPlaced': return [3 /*break*/, 1];
                        case 'BetPlaced': return [3 /*break*/, 1];
                        case 'MarketResolved': return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, processPredictionPlaced(event)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, processMarketResolved(event)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5: 
                // unknown event - just log for now
                return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function processPredictionPlaced(ev) {
    return __awaiter(this, void 0, void 0, function () {
        var line, forwardUrl, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    line = "PREDICTION | ".concat(Date.now(), " | ").concat(JSON.stringify(ev), "\n");
                    fs.appendFileSync(path.join(LOG_DIR, 'predictions.log'), line);
                    forwardUrl = process.env.ENVOI_FORWARD_URL;
                    if (!forwardUrl) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post(forwardUrl, ev, { timeout: 5000 })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    // ignore forwarding errors for now but log them
                    fs.appendFileSync(path.join(LOG_DIR, 'envoi-errors.log'), "".concat(new Date().toISOString(), " | forward failed | ").concat(err_1, "\n"));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function processMarketResolved(ev) {
    return __awaiter(this, void 0, void 0, function () {
        var args, marketId, winningOutcome, line, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = ev.args || {};
                    marketId = typeof args.marketId === 'number' ? args.marketId : Number(args.marketId);
                    winningOutcome = !!args.winningOutcome;
                    line = "MARKET_RESOLVED | ".concat(Date.now(), " | marketId=").concat(marketId, " | winning=").concat(winningOutcome, " | ").concat(JSON.stringify(ev), "\n");
                    fs.appendFileSync(path.join(LOG_DIR, 'market-resolved.log'), line);
                    if (!(process.env.BACKEND_SHOULD_CALL_RESOLVE === 'true')) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, hedraService_1.resolveMarketOnchain)(marketId, winningOutcome)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    fs.appendFileSync(path.join(LOG_DIR, 'envoi-errors.log'), "".concat(new Date().toISOString(), " | onchain resolve failed | ").concat(err_2, "\n"));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Helper to validate an HMAC signature if Envio provides one. If you want signature
 * verification, set ENVOI_WEBHOOK_SECRET in your backend .env and perform HMAC SHA256
 * over the raw body. Note: express.json() will have parsed the body already. To verify
 * raw bodies, you'd need to capture raw bytes in middleware. This helper exists for
 * reference and is not currently wired to the express route.
 */
function verifyEnvoiSignature(rawBody, signature) {
    var secret = process.env.ENVOI_WEBHOOK_SECRET;
    if (!secret || !signature)
        return false;
    var expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}
exports.default = { handleEnvoiInbound: handleEnvoiInbound };
