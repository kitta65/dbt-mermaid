{% snapshot products_snapshot %}
    {{
        config(
            target_database="postgres",
            target_schema="snapshot",
            unique_key="id",
            strategy="timestamp",
            updated_at="updated_at",
        )
    }}
    select *
    from {{ source("source", "products") }}
{% endsnapshot %}
