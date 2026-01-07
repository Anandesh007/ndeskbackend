# Payroll management system

Introduction:

    -> This module is based on the both automated and manual payment system.The payroll is always calculated automatically.A payment is done by monthly wise.The schedule flow are explain below

    Schedule flow:

            bonus and deduction calculate function triggered first
                                    |
            after one hour payroll is calculated and pushed into payroll table
                                    |
            after completed payroll,all employees payroll detail sent through notification to admin(if any correction, admin switch to manual pay)
                                    |
            after two hours, payment are made automatically or by manual pay by admin
                                    |
            after one hour, payslips are sent to the each only of the employees in the office.

    Note: In this module,Majorly previous month can be fetched,because, the payroll can be calculated based on the past data of the employees.

# Module used:

        1.Bonus service - festival and yearly bonus for top three.
        2.Deduction service - tax/PF and others
        3.Notification service - all payroll sent to the admin and payslip is sent to the employees after payment.
        4.Payment service - It has two ways are autopay and manual pay.
        5.Payslip service - payment completed it is sent to the employees.

# 1.Bonus Service:
    a.Festival Bonus:
        ->This bonus is added by admin or already predefined bonus are set in the specific month for all active employees.

    code location: Payroll-service/src/services/bonus.service.js

    Endpoint:
        POST http://localhost:portno/api/bonus/festival

        Requestbody:    
            {
                "festivalName": "Diwali",
                "month":9,
                "year":2025,
                "amount": 5000
            }

        Requestbody validation:
            1.festivalName : String
            2.month        : Integer
            3.year         : Integer
            4.amount       : numeric(10,2)

        Success response:(200)
            {
                "success": true,
                "message": "Festival bonus applied"
            }

        if already festival applied means it throws below error:
           {
                "success": false,
                "message": "Festival bonus already applied for all employees"
           }

        Server Error(500)
            {
                "success": false,
                "message": "Internal server error"
            }


    B.Performance Bonus:
        ->This bonus is applied for top 3 best performers yearly in the office, it is applied only once in a year.It is worked based on the performance module.so, the top performer can be fetched from other module.It may cause some fetching error,because It may not server run and other issues.

        code location: Payroll-Service/src/service/bonus.service.js

        Note: Here, I create a dummy api as z_dummy_api in this project directory. it runs on the port 3000.it is for testing purpose The code location to start server is Payroll-service/z_dummy_api.

        EndPoint:
            POST http://localhost:portno/api/bonus/performance

        Requestbody:
            No request body for this

        Success Response(200):
            {
                "success": true,
                "message": "Performance bonus applied"
            }
        If already performance bonus applied for all employees.It shows below error:
            {
                "success": false,
                "message": "Performance bonus already applied for top 3 employees"
            }

        Server Error(500)
            {
                "success": false,
                "message": "Internal server error"
            }

# 2.Deduction Service
        ->In this service, the deduction are applied for each employee from fixeamount table(tax,pf and esi containing table) and store in the deduction table.

    a.Calculate Deduction:
        code location:payroll-service/src/services/payrollCalculation.service.js

        EndPoint:
        POST http://localhost:portno/api/deduction/calculate

        Requestbody:
            No request body for this.

        Success Response(200):
        {
            "success": true,
            "message": "Employee deductions calculated successfully"
        }

        if the deduction already applied means, it throws below error
        {
            "success": false,
            "message": "Failed to calculate employee deductions"
        }

# 3.Notification Service:
        ->In this service,the calculated payroll is sent to the admin and each payslip is sent to their respective employees.

    
        Note 1: ADMIN_MAIL,MAIL_USER,MAIL_PASS in .env file is mandatory to implement this.

        Note 2:This notification are sending the calculatd payroll for previous month like, if current month is december 2025, it will send the november 2025 to them.
    
    a.Notification to admin
        code location:payroll-service/src/services/adminNotification.service.js

        Endpoint:
        POST http://localhost:portno/api/admin-summary

        Requestbody:
        No request body for this

        Success Response(200):
        {
            "success": true,
            "message": "Payroll summary has been sent successfully!"
        }

        Server Error(500):
        {
        "success": false,
        "error": "An error occurred while sending the payroll summary."
        }
    
    b.Notification of payslip to each employee:
        code location:payroll-service/src/services/employeeNotification.service.js

        Endpoint:
        POST http://localhost:portno/api/notification/send-payslip

        Requestbody:
        No request body needed for this

        Success Response(200):
        {
            "success": true,
            "message": "All mails sent successfully"
        }

        Server Error(500):
        {  
            "success":false,
            "message": "Failed to send payslip emails" 
        }


# 4.Payroll Service:
        ->In this service,It will fetch the data from specific salary for employee and bonus,deduction of the month and also fetch the office days and each employee worked days.

        code location: payroll-service/src/service/payrollCalculation.service.js(internally calculated)

        ->This function is used under PayrollRun.service.js.This runs payroll for all individual active employees.

        code location:payrollrun.service.js

        Endpoint:
        POST http://localhost:portno/api/payroll-run/run

        Request Body:
            No request body for this

        Success Response(200):
        {
            "success": true,
            "message": "Payroll run started",
            "data": {
                "payrollRunId": "ba839b5a-3888-4a06-a1f2-21cf24193424",
                "totalEmployees": 2
            }
        }

        If payroll already run for this month,It arise below error:
        {
            "success": false,
            "message": "Payroll already executed for this month"
        }


# 5.Payment Service:
        ->In this service, the payment is credited to all the employees in both manual and autopay.

        a.Manual Pay:
            ->The payment made by admin itself for each employee.

        code location:payroll-service/src/services/payment.service.js

        Endpoint:

        POST http://localhost:portno/api/payment/manual

        Requestbody:
        {
            "month":12,
            "year":2025,
            "employeeId": "NEX0001"
        }

        RequestBody validation:

        1.month - Integer (it must be greater than 1 and less than 12 include two)
        2.year - Integer (it must be greater than 2000 and less than 2100)
        3.employeeId - It must be string

        Success Response(200):
        {
            "success": true,
            "message": "Payment successful",
            "data": {
                "paymentId": "15",
                "payrollId": "201",
                "employeeId": "NEX0001",
                "amount": "46000",
                "paymentMode": "MANUAL",
                "paymentStatus": "SUCCESS",
                "transactionRef": "TXN-f6a8bc68-aa0a-48f6-9287-7a8e09d42839",
                "paidAt": "2026-01-01T14:12:08.895Z"
            }
        }

        If payment already done means, it arise below error:
        {
            "success": false,
            "message": "Payment already completed"
        }

        b.Auto Pay
            ->It is credited the salary based on the each employee and it automatically paid in scheduled manner.

        ## code location: payroll-service/src/jobs/autopay.job.js

        Endpoint:
        no endpoint because it is internally processed

# 6.FixedAmount service:
        In this service, we add the deduction amount like tax, pf and esi to this service.A deduction service will take this for calculation.

        code location: payroll-service/src/fixedamount.service.js

        Note:The values are given in percentage for this service.


    a.For creation

        Endpoint:
        POST http://localhost:portno/api/fixed-amount/create 

        Request Body:
        {
            "type": "PF",
            "percentage": 12
        }

        Success response(200):
        {
            "success": true,
            "data": {
                "id": 8,
                "type": "PF",
                "percentage": "12",
                "created_at": "2026-01-02T07:29:54.662Z"
            }
        }

        if it already exist means, It arise below error:
        
        {
            "success": false,
            "message": "This type already exist"
        }

    b.For Get all values:

        Endpoint:
            GET http://localhost:portno/api/fixed-amount/getall

        Success Response(200):
            {
                "success": true,
                "data": [
                {
                    "id": 8,
                    "type": "PF",
                    "percentage": "12",
                    "created_at": "2026-01-02T07:29:54.662Z"
                },
                {
                    "id": 9,
                    "type": "TAX",
                    "percentage": "15",
                    "created_at": "2026-01-02T07:57:21.228Z"
                }
                ]
            }
        
    C.For get value by specific type

        Endpoint:
        GET http://localhost:portno/api/fixed-amount/get/tax

        Success Response(200):
        {
            "success": true,
            "data": {
                "id": 9,
                "type": "TAX",
                "percentage": "15",
                "created_at": "2026-01-02T07:57:21.228Z"
            }
        }

    d.For update the data in the specific type:

        Endpoint:
        PUT http://localhost:portno/api/fixed-amount/update/pf

        Success Response(200):
        {
            "success": true,
            "data": {
                "id": 8,
                "type": "PF",
                "percentage": "20",
                "created_at": "2026-01-02T07:29:54.662Z"
            }
        }

    e.For delete the type from the table:

        Endpoint:
        DELETE http://localhost:portno/api/fixed-amount/delete/pf

        Success response(200):
        {
            "success": true,
            "message": "Deleted successfully"
        }













        
        
        

        
            
    
