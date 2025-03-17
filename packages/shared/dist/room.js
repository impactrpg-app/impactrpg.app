"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSchema = exports.Room = exports.TabletopObject = exports.Vector2 = exports.TabletopObjectType = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
var TabletopObjectType;
(function (TabletopObjectType) {
    TabletopObjectType[TabletopObjectType["None"] = 0] = "None";
    TabletopObjectType[TabletopObjectType["Image"] = 1] = "Image";
    TabletopObjectType[TabletopObjectType["Stroke"] = 2] = "Stroke";
})(TabletopObjectType || (exports.TabletopObjectType = TabletopObjectType = {}));
class Vector2 {
    x;
    y;
}
exports.Vector2 = Vector2;
class TabletopObject {
    uuid;
    type;
    position;
    rotation;
    scale;
    locked;
    image;
    stroke;
    strokeWidth;
    strokeColor;
}
exports.TabletopObject = TabletopObject;
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], TabletopObject.prototype, "uuid", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", Number)
], TabletopObject.prototype, "type", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", Vector2)
], TabletopObject.prototype, "position", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", Number)
], TabletopObject.prototype, "rotation", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", Number)
], TabletopObject.prototype, "scale", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], TabletopObject.prototype, "locked", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: false }),
    __metadata("design:type", String)
], TabletopObject.prototype, "image", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: false }),
    __metadata("design:type", String)
], TabletopObject.prototype, "stroke", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: false }),
    __metadata("design:type", Number)
], TabletopObject.prototype, "strokeWidth", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: false }),
    __metadata("design:type", String)
], TabletopObject.prototype, "strokeColor", void 0);
let Room = class Room {
    name;
    owner;
    objects;
};
exports.Room = Room;
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        required: true,
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    }),
    __metadata("design:type", mongoose_1.default.Schema.Types.ObjectId)
], Room.prototype, "owner", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        required: true,
        type: [TabletopObject]
    }),
    __metadata("design:type", Array)
], Room.prototype, "objects", void 0);
exports.Room = Room = __decorate([
    (0, mongoose_2.Schema)()
], Room);
exports.RoomSchema = mongoose_2.SchemaFactory.createForClass(Room);
//# sourceMappingURL=room.js.map