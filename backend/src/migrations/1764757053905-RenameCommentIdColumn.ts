import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameCommentIdColumn1764757053905 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Удаляем FK на user_id
    await queryRunner.query(`
            ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4c675567d2a58f0b07cef09c13d\`;
        `);

    // Удаляем FK на parentId
    await queryRunner.query(`
            ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_comments_parent_comment_id_comments\`;
        `).catch(() => {}); // если FK с автоматическим именем, безопасно игнорируем ошибку

    // Удаляем FK на files.comment_id
    await queryRunner.query(`
            ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_db7b86afe40dda812511f3dc91c\`;
        `);

    // Переименовываем колонку id → comment_id
    await queryRunner.query(`
            ALTER TABLE \`comments\` CHANGE \`id\` \`comment_id\` int NOT NULL AUTO_INCREMENT;
        `);

    // Восстанавливаем FK на users.user_id
    await queryRunner.query(`
            ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_comments_user_id_users\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE;
        `);

    // Восстанавливаем FK parentId на comment_id
    await queryRunner.query(`
            ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_comments_parent_comment_id_comments\` FOREIGN KEY (\`parentId\`) REFERENCES \`comments\`(\`comment_id\`) ON DELETE CASCADE;
        `);

    // Восстанавливаем FK files.comment_id → comments.comment_id
    await queryRunner.query(`
            ALTER TABLE \`files\` ADD CONSTRAINT \`FK_files_comment_id_comments\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comments\`(\`comment_id\`) ON DELETE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем новые FK
    await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_files_comment_id_comments\`;`);
    await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_comments_parent_comment_id_comments\`;`);
    await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_comments_user_id_users\`;`);

    // Переименовываем comment_id → id
    await queryRunner.query(`
            ALTER TABLE \`comments\` CHANGE \`comment_id\` \`id\` int NOT NULL AUTO_INCREMENT;
        `);

    // Восстанавливаем старые FK
    await queryRunner.query(`
            ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4c675567d2a58f0b07cef09c13d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE;
        `);

    await queryRunner.query(`
            ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_comments_parent_comment_id_comments\` FOREIGN KEY (\`parentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE;
        `);

    await queryRunner.query(`
            ALTER TABLE \`files\` ADD CONSTRAINT \`FK_db7b86afe40dda812511f3dc91c\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE;
        `);
  }
}
