with
    events as (select * from {{ ref("stg_events") }}),

    sessions as (
        select session_id, min(ts) as min_ts, max(ts) as max_ts from events group by 1
    )

select *
from sessions
