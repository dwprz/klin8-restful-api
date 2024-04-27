INSERT INTO users (email, "fullName", "photoProfile", role)
VALUES ('nilai_email', 'nilai_kolom_lain', 'abc','USER')
ON CONFLICT (email) DO UPDATE
SET "fullName" = 'nilai_baru_kolom_lain', "photoProfile" = 'abc', role = 'USER';

SELECT * FROM users;