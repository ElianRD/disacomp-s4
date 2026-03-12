import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';

@Injectable()
export class UpdateClientUseCase {
  constructor(private readonly repo: ClientRepository) {}

  async execute(dto: {
    id: string;
    nombre?: string;
    rnc?: string;
    direccion?: string;
    telefono?: string;
  }): Promise<void> {
    const existing = await this.repo.findById(dto.id);
    if (!existing) throw new Error(`Cliente con id ${dto.id} no encontrado`);

    const updated = Client.create({
      id: existing.id,
      nombre: dto.nombre ?? existing.nombre,
      rnc: dto.rnc ?? existing.rnc.getValue(),
      direccion: dto.direccion ?? existing.direccion,
      telefono: dto.telefono ?? existing.telefono,
    });
    await this.repo.update(updated);
  }
}
