# ALICE Edge IoT SaaS

Edge computing for IoT powered by ALICE-Edge. Compress, route, and manage
thousands of devices at the boundary — before data ever reaches the cloud.

## License

AGPL-3.0

## Architecture

```
Frontend :3000  -->  API Gateway :8080  -->  Edge Engine :8081
```

| Layer | Port | Technology |
|-------|------|-----------|
| Frontend | 3000 | Next.js 14, Tailwind CSS, Zustand |
| API Gateway | 8080 | Nginx / custom proxy |
| Edge Engine | 8081 | Rust, Axum, Tokio |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/edge/compress` | Compress payload (lz4, zstd, brotli, snappy) |
| `POST` | `/api/v1/edge/decompress` | Decompress payload |
| `GET` | `/api/v1/edge/protocols` | List supported IoT protocols |
| `GET` | `/api/v1/edge/devices` | List registered IoT devices |
| `GET` | `/health` | Health check |

### POST /api/v1/edge/compress

```json
{
  "data": "raw IoT payload string",
  "algorithm": "zstd",
  "level": 9
}
```

Response:
```json
{
  "original_size": 1024,
  "compressed_size": 312,
  "algorithm": "zstd",
  "level": 9,
  "ratio": 3.28,
  "compressed_data": "..."
}
```

### POST /api/v1/edge/decompress

```json
{
  "data": "compressed payload string",
  "algorithm": "zstd"
}
```

## Getting Started

### Edge Engine (Rust)

```bash
cd services/core-engine
cargo build --release
EDGE_ADDR=0.0.0.0:8081 ./target/release/edge-engine
```

### Frontend (Next.js)

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

## Features

- **Edge Compression** — LZ4, Zstandard, Brotli, Snappy; level 0-22
- **Protocol Gateway** — MQTT, CoAP, AMQP, HTTP/2, gRPC, WebSocket
- **Device Management** — Register, monitor, and control IoT endpoints

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EDGE_ADDR` | `0.0.0.0:8081` | Edge engine bind address |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | API gateway URL |
