  
BEGIN;

INSERT INTO users (id, username, name, password, date_created)
VALUES
(1, 'demo_user_name', 'John Smith', '$2a$12$A9x3aZ5.Xmyaoun.aPYqiOI2rIqY8HXA6CLyNghOBWQY24wPIebOW', '2020-01-03T00:00:00.000Z'),
(2,	'mthanki',	'user name', '$2a$12$vrymqM0idR6zqVw/HQfQJ.D9BfUS3/woynvclN3zEiI53GyxgH4Ei', '2020-12-31 13:23:20.571328+00');

COMMIT;