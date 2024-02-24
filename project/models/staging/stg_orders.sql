select id as order_id, * except (id), from {{ source("source", "orders") }}
