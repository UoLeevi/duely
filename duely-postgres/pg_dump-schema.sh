#!/bin/sh

pg_dump -U postgres -d duely -f duely-schema.sql \
  --exclude-table-data=security_*.email_address_verification_ \
  --exclude-table-data=security_*.subdomain_ \
  --exclude-table-data=security_*.subject_ \
  --exclude-table-data=security_*.user_ \
  --exclude-table-data=security_*.subject_assignment_ \
  --exclude-table-data=security_*.token_ \
  --exclude-table-data=security_*.session_ \
  --exclude-table-data=security_*.secret_ \
  --exclude-table-data=security_*.event_ \
  --exclude-table-data=security_*.event_log_ \
  --exclude-table-data=security_*.sign_up_ \
  --exclude-table-data=security_*.security_data_ \
  --exclude-table-data=application_*.*
