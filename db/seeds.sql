USE employees_db;
INSERT INTO departments(name) VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles(title,salary,department_id) VALUES
("Sales Lead", 70000, 1),
("Lead Engineering", 100000, 2),
("Accountant", 60000, 3),
("Lawyer", 150000, 4);

INSERT INTO employees(first_name,last_name, role_id,manager_id) VALUES
("Chris", "Baird", 2, NULL),
("Yasmin", "Castillo", 3, 1);