import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateClientUseCase } from '../../../application/use-cases/create-client.use-case';
import { UpdateClientUseCase } from '../../../application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from '../../../application/use-cases/delete-client.use-case';
import { GetClientUseCase } from '../../../application/use-cases/get-client.use-case';
import { ListClientsUseCase } from '../../../application/use-cases/list-clients.use-case';

// HTTP adapter — disponible si el microservicio expone HTTP directamente (modo híbrido)
@Controller('clients')
export class ClientController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly updateClient: UpdateClientUseCase,
    private readonly deleteClient: DeleteClientUseCase,
    private readonly getClient: GetClientUseCase,
    private readonly listClients: ListClientsUseCase,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.createClient.execute(body);
  }

  @Get()
  findAll() {
    return this.listClients.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getClient.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.updateClient.execute({ id, ...body });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteClient.execute(id);
  }
}
