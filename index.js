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
            if(res.questions ==="Quit"){
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
                            connection.query("INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)", [response.title,response.salary, response.department], (err, data) => {
                                console.table(data)
                                promptUser();
                            })
                        })
                })
            }



        })
}
promptUser();