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
    fuel VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL
);

ALTER TABLE cars ADD UNIQUE idx_row_unique(model, make, manufacture_year, fuel);

create table customer_cars(
	id INT(10) not null auto_increment primary key,
    license_plate VARCHAR(10) NOT NULL,
	car_id INT(10) not null,
    customer_id INT(10) not null,
    displacement VARCHAR(3),
    color VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL,
	FOREIGN KEY (car_id) REFERENCES cars(id),
	FOREIGN KEY (customer_id) REFERENCES customers(id),
    UNIQUE(license_plate)
);

create table service_orders(
	id INT(20) not null auto_increment primary key,
    customer_car_id INT(10),
    order_status ENUM("in_progress", "canceled", "waiting_payment", "paid", "draft") NOT NULL DEFAULT "in_progress",
    service_price DECIMAL(10,2),
    service_items_price DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (customer_car_id) REFERENCES customer_cars(id)
);

create table service_types(
	id INT(10) not null auto_increment primary key,
    name VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL
);

create table service_order_items(
	id INT(20) NOT NULL auto_increment primary key,
    description VARCHAR(50) NOT NULL,
    service_order_id INT(20),
    service_type_id INT(10),
    quantity INT(4) NOT NULL,
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL,
	FOREIGN KEY (service_order_id) REFERENCES service_orders(id),
	FOREIGN KEY (service_type_id) REFERENCES service_types(id)
);

