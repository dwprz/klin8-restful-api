SELECT * FROM otp;

INSERT INTO 
    otp (email, otp) VALUES ('abc', '123457')
ON CONFLICT 
    (email)
DO UPDATE SET 
    otp = '123457';