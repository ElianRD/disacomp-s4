import { ClientProxy } from '@nestjs/microservices';
export declare class ClientsService {
    private readonly client;
    constructor(client: ClientProxy);
    create(data: any): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
}
