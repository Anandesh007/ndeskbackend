/*
  Warnings:

  - You are about to alter the column `office_days` on the `payroll` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(5,1)`.
  - You are about to alter the column `worked_days` on the `payroll` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(5,1)`.

*/
-- AlterTable
ALTER TABLE "payroll" ALTER COLUMN "office_days" SET DATA TYPE DECIMAL(5,1),
ALTER COLUMN "worked_days" SET DATA TYPE DECIMAL(5,1);
