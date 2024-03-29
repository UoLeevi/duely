-- psql -U postgres -d duely -f duely-prepare.sql

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA operation_ TO PUBLIC;
INSERT INTO security_.secret_ (name_, value_) VALUES ('jwt_hs256', pgcrypto_.gen_random_bytes(32));

INSERT INTO security_.security_data_ (key_, data_)
VALUES ('email_address:serviceaccount@duely.app', '{"is_service_account": true}');

INSERT INTO security_.security_data_ (key_, data_)
VALUES ('email_address:test@duely.app', '{"is_test_user": true}');

SELECT internal_.resource_insert_from_('internal_.form_');
SELECT internal_.resource_insert_from_('internal_.form_field_');
SELECT internal_.resource_insert_from_('internal_.page_definition_');
SELECT internal_.resource_insert_from_('internal_.page_block_definition_');
SELECT internal_.resource_insert_from_('internal_.subscription_plan_');
SELECT internal_.resource_insert_from_('internal_.transaction_fee_');
SELECT internal_.resource_insert_from_('internal_.integration_type_');
SELECT internal_.resource_insert_from_('internal_.credential_type_');
