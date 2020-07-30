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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@vendure/core");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("../entities/favorite.entity");
let FavoriteEntityResolver = class FavoriteEntityResolver {
    constructor(connection) {
        this.connection = connection;
    }
    async product(favorite, ctx) {
        let product = favorite.product;
        if (!product) {
            const favoriteWithProduct = await this.connection.getRepository(favorite_entity_1.Favorite).findOne(favorite.id, {
                relations: ['product'],
            });
            if (favoriteWithProduct) {
                product = favoriteWithProduct.product;
            }
        }
        if (product) {
            return core_1.translateDeep(product, ctx.languageCode);
        }
    }
    async customer(favorite, ctx) {
        let customer = favorite.customer;
        if (!customer) {
            const favoriteWithCustomer = await this.connection
                .getRepository(favorite_entity_1.Favorite)
                .findOne(favorite.id, {
                relations: ['customer'],
            });
            if (favoriteWithCustomer) {
                customer = favoriteWithCustomer.customer;
            }
        }
        return customer;
    }
};
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()), __param(1, core_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [favorite_entity_1.Favorite, core_1.RequestContext]),
    __metadata("design:returntype", Promise)
], FavoriteEntityResolver.prototype, "product", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()), __param(1, core_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [favorite_entity_1.Favorite, core_1.RequestContext]),
    __metadata("design:returntype", Promise)
], FavoriteEntityResolver.prototype, "customer", null);
FavoriteEntityResolver = __decorate([
    graphql_1.Resolver('Favorite'),
    __param(0, typeorm_1.InjectConnection()),
    __metadata("design:paramtypes", [typeorm_2.Connection])
], FavoriteEntityResolver);
exports.FavoriteEntityResolver = FavoriteEntityResolver;
//# sourceMappingURL=favorite-entity.resolver.js.map