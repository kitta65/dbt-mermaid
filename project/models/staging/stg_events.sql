select id as event_id, *, from {{ source("source", "events") }}
