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
exports.Favorite = void 0;
const core_1 = require("@vendure/core");
const typeorm_1 = require("typeorm");
let Favorite = class Favorite extends core_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
__decorate([
    typeorm_1.ManyToOne(type => core_1.Customer),
    __metadata("design:type", core_1.Customer)
], Favorite.prototype, "customer", void 0);
__decorate([
    typeorm_1.ManyToOne(type => core_1.Product),
    __metadata("design:type", core_1.Product)
], Favorite.prototype, "product", void 0);
Favorite = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], Favorite);
exports.Favorite = Favorite;
//# sourceMappingURL=favorite.entity.js.map