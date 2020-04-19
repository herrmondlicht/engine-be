create database engine;

use engine;

create table customers(
	id INT(10) not null auto_increment primary key,
	document_number VARCHAR(50) DEFAULT NULL,
	fullname VARCHAR(50),
    address VARCHAR(100),
    email VARCHAR(50),
    phone VARCHAR(50),
	date_of_birth DATE DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL
);

create table cars(
	id INT(10) not null auto_increment primary key,
    model VARCHAR(50),
    make VARCHAR(50),
    manufacture_year INT(4) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL
);

ALTER TABLE cars ADD UNIQUE idx_row_unique(model, make, manufacture_year);

create table customer_cars(
	id INT(10) not null auto_increment primary key,
    license_plate VARCHAR(10),
	car_id INT(10) not null,
    customer_id INT(10) not null,
    displacement VARCHAR(3),
    color VARCHAR(10),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL,
	FOREIGN KEY (car_id) REFERENCES cars(id),
	FOREIGN KEY (customer_id) REFERENCES customers(id)
);

create table service_orders(
	id INT(20) not null auto_increment primary key,
    customer_car_id INT(10),
    is_paid boolean,
    service_price DECIMAL(10,2),
    service_item_price DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (customer_car_id) REFERENCES customer_cars(id)
);

create table services(
	id INT(10) not null auto_increment primary key,
    name VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL
);

create table service_items
(
	id INT(10) not null auto_increment primary key,
    service_id INT(10),
    name VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL,
	FOREIGN KEY (service_id) REFERENCES services(id)
);

create table service_order_items(
	id INT(20) not null auto_increment primary key,
    service_order_id INT(20),
    service_item_id INT(10),
    quantity INT(3),
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL,
	FOREIGN KEY (service_order_id) REFERENCES service_orders(id),
	FOREIGN KEY (service_item_id) REFERENCES service_items(id)
);

