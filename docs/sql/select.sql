SELECT * FROM users;

DELETE FROM users;

SELECT * FROM orders;

SELECT * FROM otp;

SELECT * FROM users 
WHERE to_tsvector("fullName") @@ to_tsquery('john&doe');