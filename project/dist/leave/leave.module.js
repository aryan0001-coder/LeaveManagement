"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const leave_controller_1 = require("./leave.controller");
const leave_service_1 = require("./leave.service");
const leave_schema_1 = require("./schemas/leave.schema");
const leave_type_schema_1 = require("./schemas/leave-type.schema");
const users_module_1 = require("../users/users.module");
const email_module_1 = require("../email/email.module");
let LeaveModule = class LeaveModule {
};
exports.LeaveModule = LeaveModule;
exports.LeaveModule = LeaveModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: leave_schema_1.Leave.name, schema: leave_schema_1.LeaveSchema },
                { name: leave_type_schema_1.LeaveType.name, schema: leave_type_schema_1.LeaveTypeSchema },
            ]),
            users_module_1.UsersModule,
            email_module_1.EmailModule,
        ],
        controllers: [leave_controller_1.LeaveController],
        providers: [leave_service_1.LeaveService],
        exports: [leave_service_1.LeaveService],
    })
], LeaveModule);
//# sourceMappingURL=leave.module.js.map