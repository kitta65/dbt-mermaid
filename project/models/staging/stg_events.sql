select id as event_id, * except (id) from {{ source("source", "events") }}
