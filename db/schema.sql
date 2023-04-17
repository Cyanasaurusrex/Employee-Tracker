DROP DATABASE IF EXISTS employee_chart_db;

CREATE DATABASE employee_chart_db;

USE employee_chart_db;

CREATE TABLE departments (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
department VARCHAR(30) NOT NULL,
salary INT NOT NULL
);

CREATE TABLE employees (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
title VARCHAR(30),
manager VARCHAR(30)
);