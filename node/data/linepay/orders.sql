CREATE TABLE `orders` (
    `order_id` varchar(200) NOT NULL,
    `transaction_id` varchar(200) DEFAULT NULL,
    `amount` int(11) DEFAULT NULL,
    `status` varchar(200) DEFAULT NULL,
    `created` bigint(20) DEFAULT NULL,
    `order_info` text COMMENT 'log JSON',
    `reservation` text COMMENT 'log JSON',
    `confirm` text COMMENT 'log JSON',
    `return_code` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`order_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;