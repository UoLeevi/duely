# duely-postgres conventions

## naming

### identifiers
- as a general rule, identifiers are lower_case_underscore_separated_with_trailing_underscore_
  - this convention ensures that identifiers are not reserved key words 
    - https://www.postgresql.org/docs/current/sql-keywords-appendix.html#KEYWORDS-TABLE
  - it also makes it easier to distinguish user created identifiers from built-in identifiers and key words
- an exception to the general naming rule is that function parameters and local variables should be named using _leading_underscore without trailing underscore
- identifiers should prefer fully spelled out names instead of appreviations and possibly longer name to prevent ambiguity (e.g. prefer 'email_address_' over 'email_')

### schemas
- audit tables belong to special schema '{schema}_audit_'

### tables
- use singular naming reflecting the type of the entities it holds

### columns
- single column primary key column should be named 'uuid_'
- foreign key columns shoud prefer naming '{table}_uuid_'
  - more semantic names can also be used especially if there are multiple columns referencing the same table

### parameters and variables
- begin with underscore (e.g. '_parameter')

### primary keys
- should be of type uuid
- or in case of a joining table with composite primary key, two type uuid columns

### triggers
- triggers names as 'tr_[after_|before_|instead_of_][insert_|[or_]update_|[or_]delete_]{function}'

## auditing
- enabled for a table by calling procedure 'internal_.setup_auditing_(_table_schema, _table_name)' which creates
  - columns
    - audit_at_ timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    - audit_by_ uuid NOT NULL DEFAULT COALESCE(current_setting('security_.token_.subject_uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid;
  - separate table {schema}_audit_.{table} that has
    - same columns but without constraints
    - additional column
      - audit_op_ char(1) NOT NULL
  - trigger before update that updates values for audit_at_ and audit_by_ columns
  - trigger after insert or update that copies changed rows to {schema}_audit_.{table}
  - trigger after delete that copies deleted rows to {schema}_audit_.{table} and set audit_at_ and audit_by_ columns
- auditing feature can removed by calling procedure 'internal_.drop_auditing_(_table_schema, _table_name)'

## notifications
- enabled for a table by calling procedure 'internal_.setup_notifications_(_table_schema, _table_name)' which creates
  - trigger after insert or update or delete that will send notifications on affected rows in json format to channel '"{_table_schema}.{_table_name}"'

## application security
- application security is designed loosely based on concepts of role-based access control
  - however, instead of permissions, policies defined as predicate functions are used to allow or deny access to operations
- https://en.wikipedia.org/wiki/Role-based_access_control#Design
- schema for application security related tables is called 'security_'
- separate schema 'operation_' contains views, functions and procedures that any database user is allowed to select and execute
  - GRANT SELECT ON ALL TABLES IN SCHEMA operation_ TO PUBLIC;
  - GRANT EXECUTE ON ALL ROUTINES IN SCHEMA operation_ TO PUBLIC;
- default database user is called 'duely' and has password 'duely'
  - CREATE ROLE duely LOGIN PASSWORD 'duely';
- database user connected to database acts either as a visitor or a user
  - visitor is unauthenticated 'subject_' who has limited access to view resources
  - user is authenticated 'subject_' who has greater access to resources
- users log in using function 'operation_.log_in_user_(_user_uuid uuid, _password text)
  - the function returns a record with column 'jwt_' that has a json web token that can be used to start authenticated session for the user
- every user session is started by calling 'operation_.begin_session_(_jwt text, _tag text)' and ended by calling 'operation_.end_session_()'
- users log out using function 'operation_.log_out_user_(_jwt text)'
- the uuid_ for the current application user is stored into a session variable 'security_.token_.subject_uuid_'
  - e.g. 
    PERFORM set_config('security_.token_.subject_uuid_', _user_uuid::text, 'f');
    ...
    SELECT current_setting('security_.token_.subject_uuid_', 't') _user_uuid;
- subjects can perform operations which they are
  - not denied to perform by any policy
  - and allowed to perform by at least one policy

### tables
- secret_ (x)
  - uuid_
  - name_
  - value_
- token_ (t)
  - uuid_
  - subject_uuid_
  - jwt_
  - issued_at_
  - revoked_at_
- session_ (se)
  - uuid_
  - login_uuid_
  - begin_at_
  - end_at_
  - tag_
- event_ (e)
  - uuid_
  - operation_uuid_
  - session_uuid_
  - args_
  - event_at_
- subdomain_ (d)
  - uuid_
  - name_
- email_address_verification_ (e)
  - uuid_
  - email_address_
  - verification_code_
- user_ (u)
  - uuid_
  - email_address_
  - password_hash_
- subject_ (s)
  - uuid_
  - name_
  - type_
- role_ (r)
  - uuid_
  - name_
- operation_ (o)
  - uuid_
  - name_
  - require_subject_type_
- subject_assignment_ (sa)
  - uuid_
  - role_uuid_
  - subdomain_uuid_
  - subject_uuid_
- role_hierarchy_ (rh)
  - uuid_
  - role_uuid_
  - subrole_uuid_
- policy_assignment_ (pa)
  - uuid_
  - policy_name_
  - operation_uuid_
  - type_

### columns
- for tables 'subdomain_', 'role_', 'operation_' column 'name_' is not null and has unique constraint
  - this column is used to make it more simple to reason about access control logic

### views
- security_.active_subject_
  - uuid_
  - name_
  - type_
  - email_address_
- security_.active_user_
  - uuid_
  - name_
  - email_address_
- security_.active_role_
  - uuid_
  - name_
  - subdomain_uuid_

### routines
- operation_.begin_visit_() RETURNS text
- operation_.end_visit() RETURNS security_.token_
- operation_.start_email_address_verification_(_email_address text) RETURNS security_.email_address_verification_
- operation_.sign_up_user_(_email_address text, _verification_code text, _name text, _password text) RETURNS security_.user_
- operation_.log_in_user_(_email_address text, _password text) RETURNS text
- operation_.log_out_user_(_user_uuid uuid, _password text) RETURNS security_.token_
- operation_.begin_session_(_jwt text, _tag text) RETURNS security_.session_
- operation_.end_session_() RETURNS security_.session_
- security_.raise_if_unauthorized_(_operation_name text, _subdomain_uuid uuid)

TODO:
- security_.control_operation_(_operation_name text, VARIADIC _args text[]) RETURNS security_.event_                          <- instead use this
  - control_operation_ is responsible for:
    - performing the authorization checks
      - check each policy that has been set for that action
      - policies are implemeted as functions in schema 'policy_' with signature {policy}(_args text[]) RETURNS boolean
    - logging events


- security_.log_event(_operation_name text, VARIADIC _args text[]) RETURNS security_.event_

## application data
- all application data, except data related to application security and auditing, resides in schema 'application_'

### tables
- agency_
  - uuid_
  - subdomain_uuid_
  - name_
- service_
  - uuid_
  - agency_uuid_
  - name_

### columns
- for tables 'agency_' column 'name_' is not null and has unique constraint
- for tables 'service_' column 'name_' is not null and has unique constraint with column 'agency_uuid_'

### functions
- operation_.create_agency_(_name text, _subdomain_name text) RETURNS application_.agency_
- operation_.delete_agency_(_agency_uuid uuid) RETURNS application_.agency_
- operation_.create_service_(_name text, _agency_uuid uuid) RETURNS application_.service_
- operation_.delete_service_(_service_uuid uuid) RETURNS application_.service_
