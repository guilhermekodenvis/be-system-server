/* eslint-disable indent */
import { MigrationInterface, QueryRunner } from 'typeorm'

export default class AlterCashierMovimentsTableNameToCashier1606140108130
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		queryRunner.renameTable('cashier_moviments', 'cashier')
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.renameTable('cashier', 'cashier_moviments')
	}
}
