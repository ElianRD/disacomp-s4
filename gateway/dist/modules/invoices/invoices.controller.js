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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoices_service_1 = require("./invoices.service");
const pdf_generator_service_1 = require("./pdf-generator.service");
const create_invoice_dto_1 = require("./dtos/create-invoice.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let InvoicesController = class InvoicesController {
    invoicesService;
    pdfGeneratorService;
    constructor(invoicesService, pdfGeneratorService) {
        this.invoicesService = invoicesService;
        this.pdfGeneratorService = pdfGeneratorService;
    }
    async create(body) {
        try {
            return await this.invoicesService.create(body);
        }
        catch (error) {
            if (error.message?.includes('ya existe')) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
    findAll(user) {
        const clientId = user.role === 'CLIENT' ? user.clientId : undefined;
        return this.invoicesService.findAll(clientId);
    }
    async getPdfReport(startDate, endDate, res) {
        const report = await this.invoicesService.getSalesReport(startDate, endDate);
        await this.pdfGeneratorService.generateSalesReportPdf(report, startDate, endDate, res);
    }
    async findOne(id) {
        try {
            return await this.invoicesService.findOne(id);
        }
        catch (error) {
            if (error.message?.includes('no encontrada')) {
                throw new common_1.NotFoundException(error.message);
            }
            throw error;
        }
    }
    async update(id, body) {
        try {
            return await this.invoicesService.update(id, body);
        }
        catch (error) {
            if (error.message?.includes('no encontrada')) {
                throw new common_1.NotFoundException(error.message);
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.invoicesService.remove(id);
        }
        catch (error) {
            if (error.message?.includes('no encontrada')) {
                throw new common_1.NotFoundException(error.message);
            }
            throw error;
        }
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva factura' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'La factura ha sido creada satisfactoriamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las facturas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de facturas retornada exitosamente.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('report/pdf'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getPdfReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una factura por su ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Factura retornada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'El ID no es un UUID válido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Factura no encontrada.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una factura existente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'La factura ha sido actualizada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'El ID no es un UUID válido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Factura no encontrada.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una factura' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'La factura ha sido eliminada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'El ID no es un UUID válido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Factura no encontrada.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "remove", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, swagger_1.ApiTags)('Invoices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService,
        pdf_generator_service_1.PdfGeneratorService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map