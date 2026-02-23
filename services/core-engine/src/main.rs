//! ALICE Edge IoT SaaS — Core Engine
//!
//! Axum-based HTTP engine exposing compression, protocol gateway,
//! and device management endpoints for edge IoT workloads.

use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::{
    net::SocketAddr,
    sync::Arc,
    time::Instant,
};
use tracing::info;
use tracing_subscriber::EnvFilter;

// ── State ──────────────────────────────────────────────────────────────────

#[derive(Clone)]
struct AppState {
    start_time: Instant,
}

// ── Request / Response types ───────────────────────────────────────────────

#[derive(Debug, Deserialize)]
struct CompressRequest {
    data: String,
    algorithm: String,
    level: u8,
}

#[derive(Debug, Serialize)]
struct CompressResponse {
    original_size: usize,
    compressed_size: usize,
    algorithm: String,
    level: u8,
    ratio: f64,
    compressed_data: String,
}

#[derive(Debug, Deserialize)]
struct DecompressRequest {
    data: String,
    algorithm: String,
}

#[derive(Debug, Serialize)]
struct DecompressResponse {
    decompressed_size: usize,
    algorithm: String,
    decompressed_data: String,
}

#[derive(Debug, Serialize)]
struct ProtocolInfo {
    name: String,
    port: u16,
    transport: String,
    description: String,
}

#[derive(Debug, Serialize)]
struct DeviceInfo {
    id: String,
    name: String,
    protocol: String,
    status: String,
    last_seen: String,
}

#[derive(Debug, Serialize)]
struct HealthResponse {
    status: String,
    uptime_secs: u64,
    version: String,
}

// ── Handlers ───────────────────────────────────────────────────────────────

async fn health(State(state): State<Arc<AppState>>) -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        uptime_secs: state.start_time.elapsed().as_secs(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn compress(
    State(_state): State<Arc<AppState>>,
    Json(req): Json<CompressRequest>,
) -> Result<Json<CompressResponse>, (StatusCode, String)> {
    let valid_algorithms = ["lz4", "zstd", "brotli", "snappy"];
    if !valid_algorithms.contains(&req.algorithm.as_str()) {
        return Err((
            StatusCode::BAD_REQUEST,
            format!(
                "unsupported algorithm '{}'; valid: lz4, zstd, brotli, snappy",
                req.algorithm
            ),
        ));
    }
    if req.level > 22 {
        return Err((
            StatusCode::BAD_REQUEST,
            "compression level must be 0-22".to_string(),
        ));
    }

    let original_size = req.data.len();
    // Simulated compression: encode to base64 with level-dependent shrink factor
    let shrink = 1.0_f64 - (req.level as f64 * 0.03).min(0.6);
    let compressed_size = ((original_size as f64) * shrink).max(1.0) as usize;
    let ratio = original_size as f64 / compressed_size as f64;

    // Produce a deterministic placeholder compressed payload
    let compressed_data = format!(
        "{}:{}:{}",
        req.algorithm,
        req.level,
        &req.data[..req.data.len().min(64)]
    );

    info!(
        algorithm = %req.algorithm,
        level = req.level,
        original = original_size,
        compressed = compressed_size,
        "compress request"
    );

    Ok(Json(CompressResponse {
        original_size,
        compressed_size,
        algorithm: req.algorithm,
        level: req.level,
        ratio,
        compressed_data,
    }))
}

async fn decompress(
    State(_state): State<Arc<AppState>>,
    Json(req): Json<DecompressRequest>,
) -> Result<Json<DecompressResponse>, (StatusCode, String)> {
    let valid_algorithms = ["lz4", "zstd", "brotli", "snappy"];
    if !valid_algorithms.contains(&req.algorithm.as_str()) {
        return Err((
            StatusCode::BAD_REQUEST,
            format!(
                "unsupported algorithm '{}'; valid: lz4, zstd, brotli, snappy",
                req.algorithm
            ),
        ));
    }

    let decompressed_data = req.data.clone();
    let decompressed_size = decompressed_data.len();

    info!(algorithm = %req.algorithm, "decompress request");

    Ok(Json(DecompressResponse {
        decompressed_size,
        algorithm: req.algorithm,
        decompressed_data,
    }))
}

async fn protocols(_state: State<Arc<AppState>>) -> Json<Vec<ProtocolInfo>> {
    Json(vec![
        ProtocolInfo {
            name: "MQTT".to_string(),
            port: 1883,
            transport: "TCP".to_string(),
            description: "Lightweight pub/sub messaging for constrained devices".to_string(),
        },
        ProtocolInfo {
            name: "CoAP".to_string(),
            port: 5683,
            transport: "UDP".to_string(),
            description: "Constrained Application Protocol for IoT RESTful services".to_string(),
        },
        ProtocolInfo {
            name: "AMQP".to_string(),
            port: 5672,
            transport: "TCP".to_string(),
            description: "Advanced Message Queuing Protocol for reliable messaging".to_string(),
        },
        ProtocolInfo {
            name: "HTTP/2".to_string(),
            port: 443,
            transport: "TCP/TLS".to_string(),
            description: "Multiplexed HTTP for efficient edge API communication".to_string(),
        },
        ProtocolInfo {
            name: "gRPC".to_string(),
            port: 50051,
            transport: "TCP/TLS".to_string(),
            description: "High-performance RPC for edge microservices".to_string(),
        },
        ProtocolInfo {
            name: "WebSocket".to_string(),
            port: 8080,
            transport: "TCP".to_string(),
            description: "Full-duplex channel for real-time device telemetry".to_string(),
        },
    ])
}

async fn devices(_state: State<Arc<AppState>>) -> Json<Vec<DeviceInfo>> {
    Json(vec![
        DeviceInfo {
            id: "dev-001".to_string(),
            name: "Temperature Sensor A".to_string(),
            protocol: "MQTT".to_string(),
            status: "online".to_string(),
            last_seen: "2026-02-23T00:00:00Z".to_string(),
        },
        DeviceInfo {
            id: "dev-002".to_string(),
            name: "Pressure Gauge B".to_string(),
            protocol: "CoAP".to_string(),
            status: "online".to_string(),
            last_seen: "2026-02-23T00:00:00Z".to_string(),
        },
        DeviceInfo {
            id: "dev-003".to_string(),
            name: "Humidity Monitor C".to_string(),
            protocol: "HTTP/2".to_string(),
            status: "offline".to_string(),
            last_seen: "2026-02-22T18:30:00Z".to_string(),
        },
        DeviceInfo {
            id: "dev-004".to_string(),
            name: "Vibration Sensor D".to_string(),
            protocol: "gRPC".to_string(),
            status: "online".to_string(),
            last_seen: "2026-02-23T00:00:00Z".to_string(),
        },
        DeviceInfo {
            id: "dev-005".to_string(),
            name: "Gateway Node E".to_string(),
            protocol: "AMQP".to_string(),
            status: "online".to_string(),
            last_seen: "2026-02-23T00:00:00Z".to_string(),
        },
    ])
}

// ── Main ───────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("edge_engine=info")),
        )
        .init();

    let state = Arc::new(AppState {
        start_time: Instant::now(),
    });

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/v1/edge/compress", post(compress))
        .route("/api/v1/edge/decompress", post(decompress))
        .route("/api/v1/edge/protocols", get(protocols))
        .route("/api/v1/edge/devices", get(devices))
        .with_state(state);

    let addr: SocketAddr = std::env::var("EDGE_ADDR")
        .unwrap_or_else(|_| "0.0.0.0:8081".to_string())
        .parse()
        .expect("invalid EDGE_ADDR");

    info!("ALICE Edge Engine listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind");
    axum::serve(listener, app).await.expect("server error");
}
