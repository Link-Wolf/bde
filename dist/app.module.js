"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const contribution_entity_1 = require("./contribution/contribution.entity");
const contribution_module_1 = require("./contribution/contribution.module");
const event_entity_1 = require("./event/event.entity");
const event_module_1 = require("./event/event.module");
const inscription_entity_1 = require("./inscription/inscription.entity");
const inscription_module_1 = require("./inscription/inscription.module");
const user_entity_1 = require("./user/user.entity");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 4343,
                username: 'root',
                password: 'root',
                database: 'bdedb',
                entities: [user_entity_1.User, contribution_entity_1.Contribution, event_entity_1.Event, inscription_entity_1.Inscription],
                synchronize: true
            }),
            contribution_module_1.ContributionModule,
            event_module_1.EventModule,
            inscription_module_1.InscriptionModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map