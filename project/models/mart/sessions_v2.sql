with
    events as (select * from {{ ref("stg_events") }}),

    uses as (select * from {{ ref("stg_users") }}),

    sessions as (
        select session_id, min(ts) as min_ts, max(ts) as max_ts from events group by session_id
    )

select *
from sessions
