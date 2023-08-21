const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Onion123:)',
    database: 'employees_db'
},
    console.log('Connected to employee_db database')
);

const promptUser = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'questions',
                message: 'What would you like to do?',
                choices: ([
                    "View All Employees",
                    "Add Employee",
                    "Update Employee Role",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department",
                    "Quit"
                ])

            }
        ])
        .then(res => {
            if (res.questions === "View All Employees") {
                connection.query('SELECT * FROM employees', (err, data) => {
                    console.table(data)
                    promptUser();
                })

            }
            if (res.questions === "View All Roles") {
                connection.query('SELECT * FROM roles', (err, data) => {
                    console.table(data)
                    promptUser();
                })

            }
            if (res.questions === "View All Departments") {
                connection.query('SELECT * FROM departments', (err, data) => {
                    console.table(data)
                    promptUser();
                })

            }
            if (res.questions === "Add Department") {
                inquirer
                    .prompt({
                        type: "input",
                        name: "name",
                        message: "What is the new department name?"
                    })
                    .then(response => {
                        connection.query("INSERT INTO departments(name) VALUES(?)", [response.name], (err, data) => {
                            console.table(data)
                            promptUser();
                        })
                    })
            }
            if (res.questions === "Quit") {
                process.exit();
            }
            if (res.questions === "Add Role") {
                connection.query('SELECT * FROM departments', (err, data) => {
                    const departments = data.map(department => ({ name: department.name, value: department.id }))
                    inquirer
                        .prompt([{
                            type: "input",
                            name: "title",
                            message: "What is the new role title?"
                        },
                        {
                            type: "input",
                            name: "salary",
                            message: "What is the salary"
                        },
                        {
                            type: "list",
                            name: "department",
                            message: "What department does this role belong to?",
                            choices: departments
                        }

                        ])
                        .then(response => {
                            connection.query("INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)", [response.title, response.salary, response.department], (err, data) => {
                                console.table(data)
                                promptUser();
                            })
                        })
                })
            }
            if (res.questions === "Add Employee") {
                connection.query('SELECT * FROM roles', (err, data) => {
                    const roles = data.map(role => ({ name: role.title, value: role.id }))
                    connection.query('SELECT * FROM employees', (err, data) => {
                        const employees = data.map(employee => ({ name: employee.first_name + " "+ employee.last_name, value: employee.id }))
                        inquirer
                            .prompt([{
                                type: "input",
                                name: "first",
                                message: "What is the employee's first name?"
                            },
                            {
                                type: "input",
                                name: "last",
                                message: "What is the employee's last name"
                            },
                            {
                                type: "list",
                                name: "role",
                                message: "What role does this employee belong to?",
                                choices: roles
                            },
                            {
                                type: "list",
                                name: "manager",
                                message: "What manager does this employee respond to?",
                                choices: employees
                            }

                            ])
                            .then(response => {
                                connection.query("INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?)", [response.first, response.last, response.role,response.manager], (err, data) => {
                                    console.table(data)
                                    promptUser();
                                })
                            })
                    })
                })
            }

            if (res.questions === "Update Employee Role") {
                connection.query('SELECT * FROM roles', (err, data) => {
                    const roles = data.map(role => ({ name: role.title, value: role.id }))
                    connection.query('SELECT * FROM employees', (err, data) => {
                        const employees = data.map(employee => ({ name: employee.first_name + " "+ employee.last_name, value: employee.id }))
                        inquirer
                            .prompt([
                            
                            {
                                type: "list",
                                name: "employee",
                                message: "What employee needs to update their role?",
                                choices: employees
                            },
                            {
                                type: "list",
                                name: "role",
                                message: "What role do you want to change it to?",
                                choices: roles
                            }

                            ])
                            .then(response => {
                                connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [response.role, response.employee], (err, data) => {
                                    console.table(data)
                                    promptUser();
                                })
                            })
                    })
                })
            }


        })
}
promptUser();