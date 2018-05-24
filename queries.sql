-- GO
-- CREATE TABLE registeredUsers
-- (
--     Username varchar(8) NOT NULL PRIMARY KEY,
--     FirstName varchar(255),
--     LastName varchar(255),
--     City varchar(255),
--     Country varchar(255),
--     Email VARCHAR(255),
--     UserPass varchar(10)
-- );
-- GO
-- GO 
-- DROP TABLE registeredUsers
-- GO
GO 
    SELECT * FROM Questions  
GO
-- 
-- GO
-- CREATE TABLE Categories(
--     Category VARCHAR(255) NOT NULL,
--     FK_Username VARCHAR (8) NOT NULL FOREIGN KEY REFERENCES registeredUsers(Username) ,
--     CONSTRAINT PK_Categories PRIMARY KEY (Category,FK_Username),


-- );
-- GO
-- GO
-- CREATE TABLE Questions(
--     Question VARCHAR(255) NOT NULL,
--     Answer VARCHAR(255),
--     FK_Username VARCHAR (8) NOT NULL FOREIGN KEY REFERENCES registeredUsers(Username) ,
--     CONSTRAINT PK_Questions PRIMARY KEY (Question,FK_Username)
-- );
-- GO
-- GO
-- INSERT INTO registeredUsers(Username,FirstName,LastName,
-- City,Country,Email,UserPass)
-- VALUES ('zoharavr','Zohar','Avraham',
-- 'New York','USA','zoharavr"post.bgu.ac.il','z123456');
-- GO
-- GO
-- INSERT INTO  Questions(Question,Answer,FK_Username)
-- VALUES ('What is your favorite animal','panda','zoharavr');
-- GO




