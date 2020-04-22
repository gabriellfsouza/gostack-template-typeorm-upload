import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetupDatabase1587247116320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
  }

  public async down(): Promise<void> {
    console.log('down');
  }
}
