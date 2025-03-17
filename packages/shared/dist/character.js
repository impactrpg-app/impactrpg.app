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
exports.CharacterSchema = exports.Character = exports.CharacterSkill = exports.CharacterGearItem = exports.GoodsType = exports.CharacterResources = exports.CharacterAbilities = exports.CharacterInfo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
class CharacterInfo {
    image;
    name;
    age;
    personality;
}
exports.CharacterInfo = CharacterInfo;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A base 64 image that can be used as src for html image tag',
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterInfo.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the character',
        example: 'John Doe'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterInfo.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The age of the character',
        example: 'Old'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterInfo.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The personality of the character',
        example: 'John Doe'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterInfo.prototype, "personality", void 0);
class CharacterAbilities {
    strength;
    agility;
    intelligence;
}
exports.CharacterAbilities = CharacterAbilities;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The strength of the character',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CharacterAbilities.prototype, "strength", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The agility of the character',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CharacterAbilities.prototype, "agility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The intelligence of the character',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CharacterAbilities.prototype, "intelligence", void 0);
class CharacterResources {
    endurance;
    mana;
    corruption;
    wounds;
    injury;
}
exports.CharacterResources = CharacterResources;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The endurance of the character',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CharacterResources.prototype, "endurance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The mana of the character',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CharacterResources.prototype, "mana", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The corruption of the character',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CharacterResources.prototype, "corruption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The wounds of the character',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CharacterResources.prototype, "wounds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The injury of the character',
        example: 'none'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterResources.prototype, "injury", void 0);
var GoodsType;
(function (GoodsType) {
    GoodsType["Small"] = "small";
    GoodsType["Large"] = "large";
})(GoodsType || (exports.GoodsType = GoodsType = {}));
class CharacterGearItem {
    name;
    type;
    attack;
    armor;
    description;
    isAutomaton;
}
exports.CharacterGearItem = CharacterGearItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the gear item',
        example: 'Sword'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterGearItem.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of the gear item',
        example: 'small'
    }),
    (0, mongoose_1.Prop)({ required: true, enum: GoodsType }),
    (0, class_validator_1.IsEnum)(GoodsType),
    __metadata("design:type", String)
], CharacterGearItem.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The attack of the gear item',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CharacterGearItem.prototype, "attack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The armor of the gear item',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CharacterGearItem.prototype, "armor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The description of the gear item',
        example: 'A sword'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterGearItem.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the gear item is an automaton',
        example: false
    }),
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CharacterGearItem.prototype, "isAutomaton", void 0);
class CharacterSkill {
    name;
    description;
}
exports.CharacterSkill = CharacterSkill;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the skill',
        example: 'Sword'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterSkill.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The description of the skill',
        example: 'A sword'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CharacterSkill.prototype, "description", void 0);
let Character = class Character {
    owner;
    info;
    abilities;
    resources;
    skills;
    gear;
    notes;
    progression;
};
exports.Character = Character;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The owner of the character',
        example: '123'
    }),
    (0, mongoose_1.Prop)({
        required: true,
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'User'
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Character.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true, type: CharacterInfo }),
    __metadata("design:type", CharacterInfo)
], Character.prototype, "info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true, type: CharacterAbilities }),
    __metadata("design:type", CharacterAbilities)
], Character.prototype, "abilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true, type: CharacterResources }),
    __metadata("design:type", CharacterResources)
], Character.prototype, "resources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true, type: [CharacterSkill] }),
    __metadata("design:type", Array)
], Character.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true, type: [CharacterGearItem] }),
    __metadata("design:type", Array)
], Character.prototype, "gear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The notes of the character',
        example: 'A note'
    }),
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Character.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The progression of the character',
        example: 10
    }),
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Character.prototype, "progression", void 0);
exports.Character = Character = __decorate([
    (0, mongoose_1.Schema)()
], Character);
;
exports.CharacterSchema = mongoose_1.SchemaFactory.createForClass(Character);
//# sourceMappingURL=character.js.map