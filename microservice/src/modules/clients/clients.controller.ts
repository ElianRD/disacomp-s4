import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateClientUseCase } from './application/create-client.use-case';
import { FindAllClientsUseCase } from './application/find-all-clients.use-case';
import { FindClientUseCase } from './application/find-client.use-case';
import { UpdateClientUseCase } from './application/update-client.use-case';
import { DeleteClientUseCase } from './application/delete-client.use-case';

@Controller()
export class ClientsController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly findAllClients: FindAllClientsUseCase,
    private readonly findClient: FindClientUseCase,
    private readonly updateClient: UpdateClientUseCase,
    private readonly deleteClient: DeleteClientUseCase,
  ) {}

  @MessagePattern('client.create')
  async create(@Payload() data: any) {
    await this.createClient.execute(data);
    return { success: true };
  }

  @MessagePattern('client.findAll')
  async findAll() {
    return this.findAllClients.execute();
  }

  @MessagePattern('client.findOne')
  async findOne(@Payload() id: string) {
    return this.findClient.execute(id);
  }

  @MessagePattern('client.update')
  async update(@Payload() data: any) {
    await this.updateClient.execute(data);
    return { success: true };
  }

  @MessagePattern('client.delete')
  async delete(@Payload() id: string) {
    await this.deleteClient.execute(id);
    return { success: true };
  }
}
