import { FRIEND_REQUEST } from 'src/common/constants/database-tables';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFriendRequest1722093268314 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: FRIEND_REQUEST,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'from_id',
            type: 'int',
            isNullable: false,
            unsigned: true, // 无符号整数
          },
          {
            name: 'to_id',
            type: 'int',
            isNullable: false,
            unsigned: true, // 无符号整数
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'REJECT', 'ACCEPT'],
            default: "'PENDING'",
          },
          {
            name: 'create_time',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'update_time',
            type: 'datetime',
            isNullable: true,
            default: null,
          },
        ],
        engine: 'InnoDB',
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(FRIEND_REQUEST);
  }
}
