-- psql -U postgres -d duely -f duely-prepare.sql

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA operation_ TO PUBLIC;
INSERT INTO security_.secret_ (name_, value_) VALUES ('jwt_hs256', pgcrypto_.gen_random_bytes(32));

INSERT INTO security_.security_data_ (key_, data_)
VALUES ('email_address:serviceaccount@duely.app', '{"is_service_account": true}');
