import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserIdColumn1764749023971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users CHANGE COLUMN id user_id int NOT NULL AUTO_INCREMENT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users CHANGE COLUMN user_id id int NOT NULL AUTO_INCREMENT`);
  }
}
