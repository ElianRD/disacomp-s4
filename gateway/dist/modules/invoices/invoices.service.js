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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let InvoicesService = class InvoicesService {
    client;
    constructor(client) {
        this.client = client;
    }
    async create(data) {
        return (0, rxjs_1.firstValueFrom)(this.client.send('invoice.create', data));
    }
    async findAll(clientId) {
        return (0, rxjs_1.firstValueFrom)(this.client.send('invoice.findAll', { clientId }));
    }
    async findOne(id) {
        return (0, rxjs_1.firstValueFrom)(this.client.send('invoice.findOne', id));
    }
    async update(id, data) {
        return (0, rxjs_1.firstValueFrom)(this.client.send('invoice.update', { id, data }));
    }
    async remove(id) {
        return (0, rxjs_1.firstValueFrom)(this.client.send('invoice.delete', id));
    }
    async getSalesReport(startDate, endDate) {
        return (0, rxjs_1.firstValueFrom)(this.client.send('invoice.salesReport', { startDate, endDate }));
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MAIN_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map