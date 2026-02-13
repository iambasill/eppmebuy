import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPendingToUserStatus1770934842815 implements MigrationInterface {
    name = 'AddPendingToUserStatus1770934842815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."users_status_enum" ADD VALUE 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // PostgreSql does not support removing values from an enum type easily.
        // Down migration for adding an enum value is typically left empty or requires recreating the type.
    }

}
