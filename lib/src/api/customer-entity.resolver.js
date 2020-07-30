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
exports.CustomerEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
const favorite_entity_1 = require("../entities/favorite.entity");
let CustomerEntityResolver = class CustomerEntityResolver {
    constructor(listQueryBuilder) {
        this.listQueryBuilder = listQueryBuilder;
    }
    favorites(customer) {
        return this.listQueryBuilder
            .build(favorite_entity_1.Favorite, undefined, {
            where: {
                customer,
            },
            relations: ['product', 'product.featuredAsset'],
        })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
            items,
            totalItems,
        }));
    }
};
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Customer]),
    __metadata("design:returntype", void 0)
], CustomerEntityResolver.prototype, "favorites", null);
CustomerEntityResolver = __decorate([
    graphql_1.Resolver('Customer'),
    __metadata("design:paramtypes", [core_1.ListQueryBuilder])
], CustomerEntityResolver);
exports.CustomerEntityResolver = CustomerEntityResolver;
//# sourceMappingURL=customer-entity.resolver.js.map