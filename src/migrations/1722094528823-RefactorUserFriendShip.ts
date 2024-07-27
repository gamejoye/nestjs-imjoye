import { USER_FRIENDSHIP } from 'src/common/constants/database-tables';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RefactorUserFriendShip1722094528823 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 删除 `updateTime` 列
    await queryRunner.dropColumn(USER_FRIENDSHIP, 'update_time');

    // 删除 `status` 列
    await queryRunner.dropColumn(USER_FRIENDSHIP, 'status');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 恢复 `updateTime` 列
    await queryRunner.addColumn(
      USER_FRIENDSHIP,
      new TableColumn({
        name: 'update_time',
        type: 'datetime',
        isNullable: true,
        default: null,
      }),
    );

    // 恢复 `status` 列
    await queryRunner.addColumn(
      USER_FRIENDSHIP,
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['PENDING', 'REJECT', 'ACCEPT'],
        default: "'PENDING'",
      }),
    );
  }
}
