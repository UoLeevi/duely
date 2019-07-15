pg_dump -U postgres -d duely -f duely-schema.sql `
  --exclude-table-data=security_*.subject_ `
  --exclude-table-data=security_*.group_ `
  --exclude-table-data=security_*.user_ `
  --exclude-table-data=security_*.group_assignment_ `
  --exclude-table-data=security_*.subject_assignment_ `
  --exclude-table-data=security_*.login_ `
  --exclude-table-data=security_*.session_ `
  --exclude-table-data=security_*.secret_ `
  --exclude-table-data=security_*.email_address_verification_