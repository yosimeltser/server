--create user table
GO
CREATE TABLE registeredUsers (
	FirstName int,
      LastName varchar(255),
      City varchar(255),
      Country varchar(255),
      Categories varchar(255),
	Verifiers varchar(255),
	Username varchar(255), 
	UserPass varchar(255)
);
GO