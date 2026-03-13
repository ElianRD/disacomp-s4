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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pdfkit_1 = __importDefault(require("pdfkit"));
const invoices_service_1 = require("./invoices.service");
let InvoicesController = class InvoicesController {
    invoicesService;
    constructor(invoicesService) {
        this.invoicesService = invoicesService;
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
    findAll() {
        return this.invoicesService.findAll();
    }
    async getPdfReport(startDate, endDate, res) {
        const report = await this.invoicesService.getSalesReport(startDate, endDate);
        const doc = new pdfkit_1.default({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-${startDate}-${endDate}.pdf`);
        doc.pipe(res);
        doc
            .fontSize(20)
            .font('Helvetica-Bold')
            .text('Reporte de Ventas', { align: 'center' });
        doc.moveDown(0.5);
        doc
            .fontSize(11)
            .font('Helvetica')
            .text(`Período: ${startDate}  →  ${endDate}`, { align: 'center' });
        doc.moveDown(1);
        doc
            .fontSize(13)
            .font('Helvetica-Bold')
            .text('Resumen');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.3);
        doc
            .fontSize(11)
            .font('Helvetica')
            .text(`Total de facturas: ${report.totalInvoices}`)
            .text(`Monto total: $${Number(report.totalSales).toFixed(2)}`);
        doc.moveDown(1);
        if (report.invoices && report.invoices.length > 0) {
            doc.fontSize(13).font('Helvetica-Bold').text('Detalle de facturas');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.3);
            report.invoices.forEach((inv, index) => {
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`${index + 1}. #${inv.invoiceNumber}  |  Cliente ID: ${inv.clientId}  |  Fecha: ${new Date(inv.date).toLocaleDateString()}  |  $${Number(inv.total).toFixed(2)}  |  ${inv.status}`);
            });
        }
        else {
            doc.fontSize(11).font('Helvetica').text('No hay facturas en este período.');
        }
        doc.end();
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
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva factura' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'La factura ha sido creada satisfactoriamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las facturas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de facturas retornada exitosamente.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map