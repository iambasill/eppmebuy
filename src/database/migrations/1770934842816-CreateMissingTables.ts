import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMissingTables1770934842816 implements MigrationInterface {
    name = 'CreateMissingTables1770934842816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" character varying(150), "device" character varying(200), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_4006c997327318ecf539ca3a13a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, "secret" character varying NOT NULL, "expires" TIMESTAMP NOT NULL, CONSTRAINT "PK_1234567890abcdef1234567890" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_799fb3aef19f2a4505f039396dc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_799fb3aef19f2a4505f039396dc"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
    }

}
