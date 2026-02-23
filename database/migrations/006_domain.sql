-- Edge IoT domain tables
create table if not exists public.devices (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    device_name text not null,
    device_type text not null,
    firmware_version text,
    protocol text default 'mqtt',
    status text default 'offline' check (status in ('online', 'offline', 'error')),
    last_seen timestamptz,
    metadata jsonb default '{}',
    created_at timestamptz default now()
);
create table if not exists public.telemetry (
    id bigserial primary key,
    device_id uuid references public.devices(id) on delete cascade,
    metric_name text not null,
    metric_value double precision not null,
    unit text,
    recorded_at timestamptz default now()
);
create table if not exists public.edge_rules (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    rule_name text not null,
    condition_expr text not null,
    action_type text not null,
    action_payload jsonb default '{}',
    enabled boolean default true,
    created_at timestamptz default now()
);
create index idx_devices_user on public.devices(user_id);
create index idx_telemetry_device on public.telemetry(device_id, recorded_at);
