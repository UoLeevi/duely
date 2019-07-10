# duely-postgres conventions

## naming

### identifiers
- as a general rule, identifiers are lower_case_underscore_separated_with_trailing_underscore_
  - this convention ensures that identifiers are not reserved key words 
    - https://www.postgresql.org/docs/current/sql-keywords-appendix.html#KEYWORDS-TABLE
  - it also makes it easier to distinguish user created identifiers from built-in identifiers and key words
- an exception to the general naming rule is that function parameters and local variables should be named using _leading_underscore without trailing underscore
- identifiers should prefer fully spelled out names instead of appreviations and possibly longer name if to prevent ambiguity (e.g. prefer 'email_address_' over 'email_')

### schemas
- audit tables belong to special schema '{schema}_audit_'

### tables
- use singular naming reflecting the type of the entities it holds

### joining tables
- named as 'table1__x__table2_'
  - the two tables are ordered alphapetically
- alternatively joining table can have more descriptive name (e.g. membership)

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
- enabled for a table by calling procedure 'setup_auditing_(_table_schema, _table_name)' which
  - adds columns
    - audit_at_ timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    - audit_by_ uuid NOT NULL DEFAULT COALESCE(current_setting('security_.session__user_uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid;
  - separate table {schema}_audit_.{table} that has
    - same columns but without constraints
    - additional column
      - audit_op_ char(1) NOT NULL
  - trigger before update that updates values for audit_at_ and audit_by_ columns
  - trigger after insert or update that copies changed rows to {schema}_audit_.{table}
  - trigger after delete that copies deleted rows to {schema}_audit_.{table} and set audit_at_ and audit_by_ columns
- auditing feature can removed by calling procedure 'drop_auditing_(_table_schema, _table_name)'

## application security
- application security is designed loosely based on concepts of role-based access control
- https://en.wikipedia.org/wiki/Role-based_access_control#Design
- schema for application security related tables is called 'security_'
- the application user's uuid_ is stored into a session variable security_.session__user_uuid_
  - e.g. 
    SET security_.session__user_uuid_ = _user_uuid;
    ...
    SELECT current_setting('security_.session__user_uuid_') _user_uuid;
- users log in using function 'security_.log_in_(_user_uuid uuid, password_ text)
  - the function returns json web token that can be used to 
- every user session is started by calling security_.begin_session_(_user_uuid uuid) and ended by calling security_.end_session_()

### tables
- session_ (se)
  - uuid_
  - user_uuid_
  - jwt_
- subdomain_ (d)
  - uuid_
  - name_
- user_ (u)
  - uuid_
  - email_address_
- group_ (g)
  - uuid_
- subject_ (s)
  - uuid_
  - name_
- role_ (r)
  - uuid_
  - name_
- permission_ (p)
  - uuid_
  - name_
- operation_ (o)
  - uuid_
  - name_
- group_assignment_ (ga)
  - group_uuid_
  - subject_uuid_
- subject_assignment_ (sa)
  - role_uuid_
  - subdomain_uuid_
  - subject_uuid_
- permission_assignment_ (pa)
  - permission_uuid_
  - role_uuid_
- role_hierarchy_ (ra)
  - role_uuid_
  - subrole_uuid_
- operation_assignment_ (oa)
  - operation_uuid_
  - permission_uuid_

### columns
- for tables 'subdomain_', 'role_', 'permission_', 'operation_' column 'name_' is not null and has unique constraint
  - this column is used to make it more simple to reason about access control logic