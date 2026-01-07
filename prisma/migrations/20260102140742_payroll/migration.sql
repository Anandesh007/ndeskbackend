-- CreateTable
CREATE TABLE "autopay_config" (
    "id" SERIAL NOT NULL,
    "is_enabled" BOOLEAN DEFAULT true,
    "effective_from" DATE,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autopay_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonus" (
    "id" SERIAL NOT NULL,
    "employee_id" VARCHAR(20) NOT NULL,
    "bonus_type" VARCHAR(20),
    "bonus_code" VARCHAR(50),
    "festival_name" VARCHAR(50),
    "amount" DECIMAL(10,2),
    "month" INTEGER,
    "year" INTEGER NOT NULL,
    "reason" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deduction" (
    "id" SERIAL NOT NULL,
    "employee_id" VARCHAR(20) NOT NULL,
    "type" VARCHAR(50) DEFAULT 'Tax',
    "amount" DECIMAL(10,2),
    "month" INTEGER,
    "year" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixedamount" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(20),
    "percentage" DECIMAL(5,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fixedamount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" BIGSERIAL NOT NULL,
    "payroll_id" BIGINT,
    "employee_id" VARCHAR(20) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_mode" VARCHAR(20),
    "payment_status" VARCHAR(20) DEFAULT 'SUCCESS',
    "transaction_ref" VARCHAR(100),
    "paid_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "payroll" (
    "payroll_id" BIGSERIAL NOT NULL,
    "employee_id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255),
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "basic_salary" DECIMAL(12,2) NOT NULL,
    "office_days" INTEGER,
    "worked_days" INTEGER,
    "allowances" DECIMAL(12,2) DEFAULT 0,
    "bonuses" DECIMAL(12,2) DEFAULT 0,
    "deductions" DECIMAL(12,2) DEFAULT 0,
    "gross_salary" DECIMAL(12,2),
    "net_salary" DECIMAL(12,2),
    "status" VARCHAR(20) DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "one_day_salary" DECIMAL(10,2),

    CONSTRAINT "payroll_pkey" PRIMARY KEY ("payroll_id")
);

-- CreateTable
CREATE TABLE "payroll_log" (
    "id" BIGSERIAL NOT NULL,
    "payroll_run_id" UUID,
    "employee_id" VARCHAR(20),
    "action" VARCHAR(50),
    "message" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_run" (
    "id" UUID NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "triggered_by" VARCHAR(20),
    "status" VARCHAR(20) DEFAULT 'PROCESSING',
    "started_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(6),

    CONSTRAINT "payroll_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslip" (
    "id" BIGSERIAL NOT NULL,
    "employee_id" VARCHAR(20) NOT NULL,
    "payroll_id" BIGINT,
    "file_path" TEXT NOT NULL,
    "generated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "payslip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salaryamount" (
    "id" SERIAL NOT NULL,
    "employee_id" VARCHAR(20) NOT NULL,
    "basic_salary" DECIMAL(10,2) NOT NULL,
    "allowances" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salaryamount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "email" VARCHAR(255),
    "password_hash" TEXT,
    "date_of_birth" DATE,
    "gender" VARCHAR(10),
    "address" TEXT,
    "contact_number" VARCHAR(15),
    "alternate_number" VARCHAR(15),
    "pan_number" VARCHAR(20),
    "aadhar_number" VARCHAR(20),
    "bank_account_no" VARCHAR(30),
    "ifsc_code" VARCHAR(15),
    "branch_name" VARCHAR(50),
    "department" VARCHAR(50),
    "role_id" INTEGER,
    "domain_id" INTEGER,
    "reporting_to" INTEGER,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "notification_log" (
    "id" BIGSERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "reference_id" BIGINT,
    "recipient" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'SENT',
    "message" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bonus_employee_id_bonus_type_bonus_code_key" ON "bonus"("employee_id", "bonus_type", "bonus_code");

-- CreateIndex
CREATE UNIQUE INDEX "deduction_employee_id_month_year_key" ON "deduction"("employee_id", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "fixedamount_type_unique" ON "fixedamount"("type");

-- CreateIndex
CREATE UNIQUE INDEX "payment_employee_id_payroll_id_key" ON "payment"("employee_id", "payroll_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_employee_month_year_unique" ON "payroll"("employee_id", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_run_month_year_key" ON "payroll_run"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "salaryamount_employee_id_key" ON "salaryamount"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
