BEGIN;

INSERT INTO users (id, username, name, password, date_created)
VALUES
(1, 'demo_user_name', 'John Smith', '$2a$12$A9x3aZ5.Xmyaoun.aPYqiOI2rIqY8HXA6CLyNghOBWQY24wPIebOW', '2020-01-03T00:00:00.000Z'),
(2,	'mthanki',	'user name', '$2a$12$vrymqM0idR6zqVw/HQfQJ.D9BfUS3/woynvclN3zEiI53GyxgH4Ei', '2020-12-31 13:23:20.571328+00');

INSERT INTO lists (category, name, note, price, weight, start_date, completed_date, checked, user_id)
VALUES 
('Vegetables', 'cabbage', 'stor name', 2.05, '2', '2020-01-03T00:00:00.000Z', '2020-04-03T00:00:00.000Z', 'false', 1),
('Fruits', 'Pineapple', 'next week new deal', 5.05, 2, '2020-01-03T00:00:00.000Z', '2022-05-03T00:00:00.000Z', 'false', 1),
('Grain', 'Maize', 'next week new deal', 3.05, 3, '2020-01-03T00:00:00.000Z', '2020-04-03T00:00:00.000Z', 'false', 1),
('Frozen', 'Frozen Strawberries', 'next week new deal', 5.05, 3, '2020-01-03T00:00:00.000Z', '2020-04-03T00:00:00.000Z', 'true', 2),
('Miscellaneous', 'Toilet Paper', 'next week new deal', 5.05, 1, '2020-01-03T00:00:00.000Z', '2020-04-03T00:00:00.000Z', 'false', 2);


COMMIT;