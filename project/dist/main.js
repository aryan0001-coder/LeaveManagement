"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const morgan_1 = __importDefault(require("morgan"));
const nest_winston_1 = require("nest-winston");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER);
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write: (message) => {
                logger.log(message.trim(), 'HTTP');
            },
        },
    }));
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    logger.log(`Application running on port ${port}`, 'NestApplication');
}
bootstrap();
//# sourceMappingURL=main.js.map