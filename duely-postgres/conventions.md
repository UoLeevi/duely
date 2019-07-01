# duely-postgres conventions

## naming

### identifiers
- are lower_case_underscore_separated
- are not reserved key words 
  - https://www.postgresql.org/docs/current/sql-keywords-appendix.html#KEYWORDS-TABLE
- should prefer fully spelled out names instead of appreviations
- should prefer longer name if to prevent ambiguity (e.g. prefer 'email_address' over 'email')

### schemas
- audit tables belong to special schema '{schema}__audit'

### tables
- use singular naming reflecting the type of the entities it holds

### joining tables
- named as 'table1__x__table2'
  - the two tables are ordered alphapetically
- alternatively joining table can have more descriptive name (e.g. membership)

### columns
- single column primary key column should be named 'uuid'
- foreign key columns shoud prefer naming '{table}_uuid'
  - more semantic names can also be used especially if there are multiple columns referencing the same table

### parameters and variables
- begin with underscore (e.g. '_parameter')

### primary keys
- should be of type uuid
- or in case of a joining table with composite primary key, two type uuid columns

## application security
- application security is designed loosely based on concepts of role-based access control
- https://en.wikipedia.org/wiki/Role-based_access_control#Design
- schema for application security related tables is called 'security'

### tables
- subject (s)
- role (r)
- permission (p)
- operation (o)
- subject_assignment (sa)
  - role_uuid
  - subject_uuid
- permission_assignment (pa)
  - permission_uuid
  - role_uuid
- role_hierarchy (ra)
  - role_uuid
  - subrole_uuid
- operation_assignment (oa)
  - operation_uuid
  - permission_uuid

### columns
- for tables 'role', 'permission' and 'operation' column 'name' is not null has unique constraint
  - this column is used to make it more simple to reason about access control logic