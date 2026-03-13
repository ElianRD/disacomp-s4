import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInvoicesTable1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'invoiceNumber', type: 'varchar', isUnique: true },
          { name: 'clientId', type: 'int' },
          { name: 'date', type: 'date' },
          { name: 'total', type: 'decimal', precision: 10, scale: 2 },
          { name: 'status', type: 'varchar', default: "'PAID'" },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
  }
}
