"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
let cachedApp = null;
async function createApp() {
    if (cachedApp) {
        return cachedApp;
    }
    const expressApp = (0, express_1.default)();
    const adapter = new platform_express_1.ExpressAdapter(expressApp);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter, {
        logger: ['error', 'warn', 'log'],
    });
    const isDev = process.env.NODE_ENV === 'development';
    const allowedOrigins = isDev
        ? [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://dev.by-zip.com',
        ]
        : [
            'https://by-zip.com',
            'https://www.by-zip.com',
            'https://app.by-zip.com',
            'https://www.app.by-zip.com',
        ];
    app.enableCors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    await app.init();
    cachedApp = expressApp;
    return expressApp;
}
exports.default = async (req, res) => {
    const app = await createApp();
    app(req, res);
};
async function bootstrap() {
    if (process.env.NODE_ENV !== 'production') {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://dev.by-zip.com',
        ];
        app.enableCors({
            origin: allowedOrigins,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            credentials: true,
        });
        app.setGlobalPrefix('api');
        const port = process.env.PORT ?? 3000;
        await app.listen(port);
        console.log(`🚀 Server running on port ${port}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
    }
}
if (require.main === module) {
    bootstrap().catch((error) => {
        console.error('❌ Error starting the application:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=main.js.map