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
exports.__esModule = true;
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var app = express();
app.use(cookieParser());
var port = process.env.PORT || 4000;
var path = require('path');
require('dotenv').config();
var JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));
var userRoute_1 = require("./routes/userRoute");
app.use('/user', userRoute_1["default"]);
var questionRoute_1 = require("./routes/questionRoute");
app.use('/questions', questionRoute_1["default"]);
//passport settings
var PASSPORT_SECRET = process.env.PASSPORT_SECRET;
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: PASSPORT_SECRET, resave: false, saveUninitialized: false }));
require('./controlers/auth'); // get google authentication
require('./controlers/db'); //connect to mongoDB
var userModel_1 = require("./models/db/userModel");
app.get('/auth', passport.authenticate('google', { scope: ['email', 'profile'] }));
app.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/fail'
}), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userJWT, UserModel, userDB, newUser, userData, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                user = req.user;
                user.role = 'public';
                user.last_entered = new Date();
                console.log("user " + user.displayName + " logged in");
                userJWT = jwt.encode({ id: user.id }, JWT_SECRET);
                UserModel = mongoose.model('UserModel', userModel_1.UserSchema);
                return [4 /*yield*/, UserModel.findOneAndUpdate({ id: user.id }, user)];
            case 1:
                userDB = _a.sent();
                if (!!userDB) return [3 /*break*/, 3];
                newUser = new UserModel(user);
                return [4 /*yield*/, newUser.save()];
            case 2:
                userData = _a.sent();
                console.log(userData);
                _a.label = 3;
            case 3:
                res.cookie('user', userJWT, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 2 });
                res.redirect('http://localhost:3000/vote');
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                res.status(500).send(err_1.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get('/logout', function (req, res) {
    req.logout();
    res.clearCookie("user");
    res.send({ login: false });
});
app.listen(port, function () { console.log('Server listen on port', port); });
