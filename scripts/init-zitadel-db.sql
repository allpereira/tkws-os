-- Cria banco do Zitadel (rodado apenas no primeiro start do Postgres em dev)
CREATE DATABASE zitadel;
GRANT ALL PRIVILEGES ON DATABASE zitadel TO tkws;
