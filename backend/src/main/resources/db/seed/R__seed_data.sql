-- Migration repetable Flyway, chargee uniquement quand spring.flyway.locations
-- inclut classpath:db/seed (profil "local", voir application-local.yml).
-- Le profil par defaut (deploiement VPS) ne charge que classpath:db/migration
-- et n'execute jamais ce fichier.
TRUNCATE TABLE employees RESTART IDENTITY;

INSERT INTO employees (first_name, last_name, position, department, hire_date, status) VALUES
    ('Marie', 'Dubois', 'Developpeuse Backend', 'IT', '2021-03-15', 'active'),
    ('Thomas', 'Martin', 'Chef de Projet', 'IT', '2019-11-02', 'active'),
    ('Camille', 'Bernard', 'Chargee de Recrutement', 'RH', '2022-06-20', 'active'),
    ('Lucas', 'Petit', 'Comptable', 'Finance', '2018-01-10', 'inactive'),
    ('Emma', 'Robert', 'Responsable Marketing', 'Marketing', '2020-09-01', 'active'),
    ('Hugo', 'Richard', 'Commercial', 'Ventes', '2023-02-14', 'active'),
    ('Lea', 'Moreau', 'Analyste Financier', 'Finance', '2017-05-23', 'inactive'),
    ('Nathan', 'Simon', 'Developpeur Frontend', 'IT', '2022-10-11', 'active'),
    ('Chloe', 'Laurent', 'Assistante RH', 'RH', '2021-07-30', 'active'),
    ('Louis', 'Lefebvre', 'Responsable Ventes', 'Ventes', '2016-12-05', 'inactive');
