import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('clients')
export class ClientOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  rnc: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;
}
