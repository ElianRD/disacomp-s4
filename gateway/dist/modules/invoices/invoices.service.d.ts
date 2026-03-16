import { ClientProxy } from '@nestjs/microservices';
export declare class InvoicesService {
    private readonly client;
    constructor(client: ClientProxy);
    create(data: any): Promise<any>;
    findAll(clientId?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
    getSalesReport(startDate: string, endDate: string): Promise<any>;
}
