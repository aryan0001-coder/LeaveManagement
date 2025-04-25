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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const leave_type_schema_1 = require("../../leave/schemas/leave-type.schema");
let SeedService = SeedService_1 = class SeedService {
    constructor(leaveTypeModel) {
        this.leaveTypeModel = leaveTypeModel;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async seedLeaveTypes() {
        this.logger.log('Seeding leave types');
        const leaveTypes = [
            { name: 'Planned Leave', description: 'Leave planned in advance' },
            { name: 'Emergency Leave', description: 'Leave for emergency situations' },
        ];
        for (const leaveType of leaveTypes) {
            const existingLeaveType = await this.leaveTypeModel.findOne({
                name: leaveType.name
            });
            if (!existingLeaveType) {
                await this.leaveTypeModel.create(leaveType);
                this.logger.log(`Created leave type: ${leaveType.name}`);
            }
            else {
                this.logger.log(`Leave type already exists: ${leaveType.name}`);
            }
        }
        this.logger.log('Leave types seeding completed');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(leave_type_schema_1.LeaveType.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map