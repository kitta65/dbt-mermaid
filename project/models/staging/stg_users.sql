with
    users as (
        select id as user_id, * except (id), from {{ source("source", "users") }}
    ),

    filterd as (
        select *
        from users as main
        where
            not exists (
                select 1
                from {{ ref("internal_users") }} as sub
                where sub.user_id = main.user_id
            )
    )

select *
from filtered
