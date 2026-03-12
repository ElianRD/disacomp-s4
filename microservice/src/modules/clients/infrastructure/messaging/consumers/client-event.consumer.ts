import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateClientUseCase } from '../../../application/use-cases/create-client.use-case';
import { UpdateClientUseCase } from '../../../application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from '../../../application/use-cases/delete-client.use-case';
import { GetClientUseCase } from '../../../application/use-cases/get-client.use-case';
import { ListClientsUseCase } from '../../../application/use-cases/list-clients.use-case';

// Adaptador de entrada: recibe mensajes de RabbitMQ y delega a los casos de uso
@Controller()
export class ClientEventConsumer {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly updateClient: UpdateClientUseCase,
    private readonly deleteClient: DeleteClientUseCase,
    private readonly getClient: GetClientUseCase,
    private readonly listClients: ListClientsUseCase,
  ) {}

  @MessagePattern('create_client')
  async onCreate(@Payload() data: any) {
    try {
      const result = await this.createClient.execute(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('find_all_clients')
  async onFindAll() {
    try {
      const result = await this.listClients.execute();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('find_client')
  async onFindOne(@Payload() data: { id: string }) {
    try {
      const result = await this.getClient.execute(data.id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('update_client')
  async onUpdate(@Payload() data: any) {
    try {
      const result = await this.updateClient.execute(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('delete_client')
  async onDelete(@Payload() data: { id: string }) {
    try {
      await this.deleteClient.execute(data.id);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
