const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ── Request / Response types ───────────────────────────────────────────────

export interface CompressRequest {
  data: string;
  algorithm: string;
  level: number;
}

export interface CompressResponse {
  original_size: number;
  compressed_size: number;
  algorithm: string;
  level: number;
  ratio: number;
  compressed_data: string;
}

export interface DecompressRequest {
  data: string;
  algorithm: string;
}

export interface DecompressResponse {
  decompressed_size: number;
  algorithm: string;
  decompressed_data: string;
}

export interface ProtocolInfo {
  name: string;
  port: number;
  transport: string;
  description: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  protocol: string;
  status: string;
  last_seen: string;
}

// ── EdgeClient ─────────────────────────────────────────────────────────────

export class EdgeClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async post<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`POST ${path} failed (${res.status}): ${text}`);
    }
    return res.json() as Promise<TRes>;
  }

  private async get<TRes>(path: string): Promise<TRes> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`GET ${path} failed (${res.status}): ${text}`);
    }
    return res.json() as Promise<TRes>;
  }

  /** Compress a payload using the specified algorithm and level. */
  compress(req: CompressRequest): Promise<CompressResponse> {
    return this.post<CompressRequest, CompressResponse>(
      "/api/v1/edge/compress",
      req,
    );
  }

  /** Decompress a payload using the specified algorithm. */
  decompress(req: DecompressRequest): Promise<DecompressResponse> {
    return this.post<DecompressRequest, DecompressResponse>(
      "/api/v1/edge/decompress",
      req,
    );
  }

  /** List all supported IoT protocols. */
  protocols(): Promise<ProtocolInfo[]> {
    return this.get<ProtocolInfo[]>("/api/v1/edge/protocols");
  }

  /** List all registered IoT devices. */
  devices(): Promise<DeviceInfo[]> {
    return this.get<DeviceInfo[]>("/api/v1/edge/devices");
  }
}
