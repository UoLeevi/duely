-- psql -U postgres -d duely -f duely-prepare.sql

GRANT SELECT ON ALL TABLES IN SCHEMA operation_ TO PUBLIC;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA operation_ TO PUBLIC;
INSERT INTO security_.secret_ (name_, value_) VALUES ('jwt_hs256', pgcrypto_.gen_random_bytes(32));
