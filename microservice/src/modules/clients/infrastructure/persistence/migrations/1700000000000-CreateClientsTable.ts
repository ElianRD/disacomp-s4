import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateClientsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clients',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'nombre', type: 'varchar', length: '255' },
          { name: 'rnc', type: 'varchar', length: '11', isUnique: true },
          { name: 'direccion', type: 'varchar', length: '500' },
          { name: 'telefono', type: 'varchar', length: '20' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clients');
  }
}
