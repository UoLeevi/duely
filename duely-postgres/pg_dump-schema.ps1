pg_dump -U postgres -d duely -f duely-schema.sql -c `
  --exclude-table-data=security_*.email_address_verification_ `
  --exclude-table-data=security_*.subdomain_ `
  --exclude-table-data=security_*.subject_ `
  --exclude-table-data=security_*.user_ `
  --exclude-table-data=security_*.subject_assignment_ `
  --exclude-table-data=security_*.token_ `
  --exclude-table-data=security_*.session_ `
  --exclude-table-data=security_*.secret_ `
  --exclude-table-data=application_*.*