
DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(100) NOT NULL,
  department VARCHAR(45) NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  stock INT(10) NOT NULL,
  PRIMARY KEY (id)
);

SELECT * FROM products;

INSERT INTO products(item_name, department, price, stock)
VALUES ("The Art of Star Wars: The Last Jedi", "BOOKS", 24.99, 40),
("Hamilton Broadway Recording", "MUSIC", 18.99, 100),
("Goodbye Yellow Brick Road", "MUSIC", 9.99, 80),
("Man of the Woods", "MUSIC", 12.99, 75),
("18-Piece Corelle Dinnerware Set", "KITCHEN", 36.50, 10),
("Calphalon Nonstick Dutch Oven", "KITCHEN", 39.99, 50),
("Capezio Pointe Shoe", "CLOTHING", 50.00, 20),
("Batman Logo T-Shirt", "CLOTHING", 15.99, 35),
("The Hobbit", "BOOKS", 10.65, 10),
("Astrophysics for People in a Hurry", "BOOKS", 9.95, 60);