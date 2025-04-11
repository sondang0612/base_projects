CREATE DATABASE cc_db_dev;
GO

USE cc_db_dev;
GO

-- CREATE TABLE users (
--     id INT PRIMARY KEY IDENTITY(1,1),
--     userName NVARCHAR(255) UNIQUE,
--     fullName NVARCHAR(255),
--     password NVARCHAR(255),
--     role VARCHAR(50) DEFAULT 'user',
--     createdAt DATETIME2 DEFAULT GETDATE(),
--     updatedAt DATETIME2 DEFAULT GETDATE(),
--     isDeleted BIT DEFAULT 0,
--     createdBy NVARCHAR(255),
--     balance DECIMAL(18, 2) DEFAULT 0,
--     playerCode NVARCHAR(255) UNIQUE,
-- );
-- GO

-- INSERT INTO users (userName, fullName, password, role, createdBy, isDeleted, balance, playerCode)
-- VALUES 
--     ('admin', 'Administrator', '$2b$12$m1ijcZnAaHyLb56BvR9BjOM3tUIoFguhQv.1zhTbStpBd68qCsMvm', 'admin', 'system_generated@gmail.com', 0, 0, 'admin'),
--     ('user1', 'User 1', '$2b$12$m1ijcZnAaHyLb56BvR9BjOM3tUIoFguhQv.1zhTbStpBd68qCsMvm', 'user', 'system_generated@gmail.com', 0, 0, 'test123'),
--     ('user2', 'User 2', '$2b$12$m1ijcZnAaHyLb56BvR9BjOM3tUIoFguhQv.1zhTbStpBd68qCsMvm', 'user', 'system_generated@gmail.com', 0, 0, 'test1');
-- GO

-- SELECT * FROM users;
-- GO