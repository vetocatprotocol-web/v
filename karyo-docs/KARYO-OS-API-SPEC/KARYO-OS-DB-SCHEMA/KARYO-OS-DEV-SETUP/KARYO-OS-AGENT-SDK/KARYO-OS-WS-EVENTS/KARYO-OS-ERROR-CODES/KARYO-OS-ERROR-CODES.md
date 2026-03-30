# KARYO OS — Error Code Registry

## Complete Error Code Reference

---

## 📋 Format

Semua error response mengikuti format standar:

```json
{
  "success": false,
  "error": {
    "code": "E1001",
    "message": "Human-readable error message",
    "details": {
      "field": "email",
      "reason": "Invalid format"
    }
  },
  "request_id": "uuid-trace-id"
}
```

---

## Error Code Structure

```
E [CATEGORY] [NUMBER]

Category Ranges:
  E0xxx — General / Validation
  E1xxx — Resource / Not Found
  E2xxx — Authentication / Authorization
  E3xxx — Rate Limiting / Quotas
  E4xxx — File / Storage
  E5xxx — AI / Agent / Execution
  E6xxx — Integration / External
  E7xxx — Billing / Payment
  E8xxx — System / Infrastructure
  E9xxx — Collaboration / Realtime
```

---

## E0xxx — General & Validation

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E0001 | 400 | Validation failed | Validasi gagal | No |
| E0002 | 400 | Invalid JSON body | Body JSON tidak valid | No |
| E0003 | 400 | Missing required field | Field wajib tidak ada | No |
| E0004 | 400 | Invalid field type | Tipe field tidak valid | No |
| E0005 | 400 | Field exceeds max length | Field melebihi panjang maksimum | No |
| E0006 | 400 | Invalid enum value | Nilai enum tidak valid | No |
| E0007 | 400 | Invalid UUID format | Format UUID tidak valid | No |
| E0008 | 400 | Invalid date format | Format tanggal tidak valid | No |
| E0009 | 400 | Invalid email format | Format email tidak valid | No |
| E0010 | 400 | Invalid URL format | Format URL tidak valid | No |
| E0011 | 400 | Request body too large | Request body terlalu besar | No |
| E0012 | 400 | Unsupported content type | Tipe konten tidak didukung | No |
| E0013 | 405 | Method not allowed | Method tidak diizinkan | No |
| E0014 | 400 | Pagination invalid | Paginasi tidak valid | No |
| E0015 | 400 | Sort field invalid | Field sorting tidak valid | No |

### Validation Response Example

```json
{
  "success": false,
  "error": {
    "code": "E0001",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "Invalid email format",
          "value": "not-an-email"
        },
        {
          "field": "password",
          "message": "Must be at least 8 characters",
          "value": null
        }
      ]
    }
  }
}
```

---

## E1xxx — Resource & Not Found

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E1001 | 404 | Resource not found | Resource tidak ditemukan | No |
| E1002 | 404 | User not found | User tidak ditemukan | No |
| E1003 | 404 | Workspace not found | Workspace tidak ditemukan | No |
| E1004 | 404 | Task not found | Task tidak ditemukan | No |
| E1005 | 404 | Agent not found | Agent tidak ditemukan | No |
| E1006 | 404 | File not found | File tidak ditemukan | No |
| E1007 | 404 | Integration not found | Integrasi tidak ditemukan | No |
| E1008 | 404 | Memory entry not found | Memory tidak ditemukan | No |
| E1009 | 404 | Subscription not found | Subscription tidak ditemukan | No |
| E1010 | 409 | Resource already exists | Resource sudah ada | No |
| E1011 | 409 | Email already registered | Email sudah terdaftar | No |
| E1012 | 409 | Workspace slug taken | Slug workspace sudah dipakai | No |
| E1013 | 409 | Agent slug taken | Slug agent sudah dipakai | No |
| E1014 | 410 | Resource deleted | Resource sudah dihapus | No |
| E1015 | 410 | Resource archived | Resource sudah diarsipkan | No |

---

## E2xxx — Authentication & Authorization

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E2001 | 401 | Authentication required | Autentikasi diperlukan | No |
| E2002 | 401 | Invalid credentials | Kredensial tidak valid | No |
| E2003 | 401 | Token expired | Token kadaluarsa | No |
| E2004 | 401 | Token invalid | Token tidak valid | No |
| E2005 | 401 | Token revoked | Token dicabut | No |
| E2006 | 403 | Insufficient permissions | Izin tidak cukup | No |
| E2007 | 403 | Workspace access denied | Akses workspace ditolak | No |
| E2008 | 403 | Resource access denied | Akses resource ditolak | No |
| E2009 | 403 | Admin access required | Akses admin diperlukan | No |
| E2010 | 403 | Owner access required | Akses owner diperlukan | No |
| E2011 | 429 | Too many login attempts | Terlalu banyak percobaan login | Yes |
| E2012 | 403 | Account suspended | Akun ditangguhkan | No |
| E2013 | 403 | Account deleted | Akun sudah dihapus | No |
| E2014 | 401 | Email not verified | Email belum diverifikasi | No |
| E2015 | 403 | API key invalid | API key tidak valid | No |
| E2016 | 403 | API key expired | API key kadaluarsa | No |

### RBAC Error Details

```json
// E2006 — Insufficient permissions
{
  "success": false,
  "error": {
    "code": "E2006",
    "message": "Insufficient permissions",
    "details": {
      "required": ["write:tasks"],
      "current_role": "viewer",
      "resource": "task",
      "action": "update"
    }
  }
}
```

---

## E3xxx — Rate Limiting & Quotas

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E3001 | 429 | Rate limit exceeded | Batas rate terlampaui | Yes |
| E3002 | 429 | Workspace task limit reached | Batas task workspace tercapai | Yes |
| E3003 | 429 | User task limit reached | Batas task user tercapai | Yes |
| E3004 | 429 | Storage quota exceeded | Kuota storage terlampaui | No |
| E3005 | 429 | API call limit exceeded | Batas API call terlampaui | Yes |
| E3006 | 429 | AI token limit reached | Batas token AI tercapai | Yes |
| E3007 | 429 | File size exceeds limit | Ukuran file melebihi batas | No |
| E3008 | 429 | Upload rate limit | Batas upload terlampaui | Yes |
| E3009 | 429 | Agent execution limit | Batas eksekusi agent tercapai | Yes |
| E3010 | 402 | Budget limit reached | Batas budget tercapai | No |

### Rate Limit Response

```json
// E3001 — Rate limit with retry info
{
  "success": false,
  "error": {
    "code": "E3001",
    "message": "Rate limit exceeded. Retry after 60 seconds.",
    "details": {
      "limit": 120,
      "remaining": 0,
      "reset_at": "2026-03-31T02:01:00Z",
      "retry_after_seconds": 60
    }
  }
}
```

### Rate Limit Headers

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1711845660
Retry-After: 60
```

---

## E4xxx — File & Storage

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E4001 | 400 | Invalid file type | Tipe file tidak valid | No |
| E4002 | 400 | File too large | File terlalu besar | No |
| E4003 | 400 | File corrupted | File rusak | No |
| E4004 | 400 | Empty file | File kosong | No |
| E4005 | 409 | File name conflict | Nama file bentrok | No |
| E4006 | 500 | Upload failed | Upload gagal | Yes |
| E4007 | 500 | Download failed | Download gagal | Yes |
| E4008 | 500 | Storage unavailable | Storage tidak tersedia | Yes |
| E4009 | 400 | File processing failed | Pemrosesan file gagal | Yes |
| E4010 | 400 | Unsupported file format | Format file tidak didukung | No |

### File Size Limits

```yaml
limits:
  free:       10 MB per file
  pro:        100 MB per file
  enterprise: 500 MB per file
  
  allowed_types:
    - application/pdf
    - text/csv
    - application/vnd.ms-excel
    - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    - application/vnd.openxmlformats-officedocument.wordprocessingml.document
    - text/plain
    - text/markdown
    - application/json
    - image/png
    - image/jpeg
    - image/webp
```

---

## E5xxx — AI / Agent / Execution

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E5001 | 500 | AI model timeout | AI model timeout | Yes |
| E5002 | 500 | AI model unavailable | AI model tidak tersedia | Yes |
| E5003 | 500 | AI model error | Error pada AI model | Yes |
| E5004 | 500 | Agent execution failed | Eksekusi agent gagal | Yes |
| E5005 | 400 | Agent not available | Agent tidak tersedia | No |
| E5006 | 400 | Agent config invalid | Konfigurasi agent tidak valid | No |
| E5007 | 408 | Agent timeout | Agent timeout | Yes |
| E5008 | 400 | Task already running | Task sedang berjalan | No |
| E5009 | 400 | Task cannot be cancelled | Task tidak bisa dibatalkan | No |
| E5010 | 400 | Invalid agent type | Tipe agent tidak valid | No |
| E5011 | 500 | Context build failed | Gagal membangun konteks | Yes |
| E5012 | 500 | Memory retrieval failed | Gagal mengambil memory | Yes |
| E5013 | 500 | Tool execution failed | Eksekusi tool gagal | Yes |
| E5014 | 500 | Output validation failed | Validasi output gagal | Yes |
| E5015 | 500 | Prompt too long | Prompt terlalu panjang | No |
| E5016 | 500 | Token limit exceeded | Batas token terlampaui | No |
| E5017 | 500 | AI safety violation | Pelanggaran keamanan AI | No |
| E5018 | 500 | Hallucination detected | Halusinasi terdeteksi | Yes |

### AI Error Details

```json
// E5003 — AI model error
{
  "success": false,
  "error": {
    "code": "E5003",
    "message": "AI model error",
    "details": {
      "model": "gpt-4o",
      "provider": "openrouter",
      "provider_error": "rate_limit_exceeded",
      "retry_after": 30,
      "fallback_available": true,
      "fallback_model": "gpt-4o-mini"
    }
  }
}
```

```json
// E5017 — AI safety violation
{
  "success": false,
  "error": {
    "code": "E5017",
    "message": "AI safety violation detected",
    "details": {
      "violation_type": "hallucination",
      "confidence": 0.95,
      "flagged_content": "...",
      "action": "require_human_review"
    }
  }
}
```

---

## E6xxx — Integration & External

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E6001 | 502 | Integration unavailable | Integrasi tidak tersedia | Yes |
| E6002 | 401 | Integration auth expired | Autentikasi integrasi kadaluarsa | No |
| E6003 | 401 | Integration auth failed | Autentikasi integrasi gagal | No |
| E6004 | 500 | Integration sync failed | Sinkronisasi gagal | Yes |
| E6005 | 400 | Integration config invalid | Konfigurasi integrasi tidak valid | No |
| E6006 | 429 | External API rate limited | Rate limit API eksternal | Yes |
| E6007 | 500 | External API error | Error API eksternal | Yes |
| E6008 | 504 | External API timeout | Timeout API eksternal | Yes |
| E6009 | 409 | Integration already connected | Integrasi sudah terhubung | No |
| E6010 | 500 | OAuth flow failed | Flow OAuth gagal | Yes |

### Integration Error by Provider

```json
// E6007 — Google Drive error
{
  "success": false,
  "error": {
    "code": "E6007",
    "message": "Google Drive API error",
    "details": {
      "provider": "google_drive",
      "provider_error": {
        "code": 403,
        "message": "The user has not granted the required permissions",
        "domain": "global",
        "reason": "forbidden"
      },
      "suggestion": "Reconnect integration with required permissions"
    }
  }
}
```

---

## E7xxx — Billing & Payment

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E7001 | 402 | Payment required | Pembayaran diperlukan | No |
| E7002 | 402 | Payment failed | Pembayaran gagal | Yes |
| E7003 | 402 | Card declined | Kartu ditolak | No |
| E7004 | 402 | Card expired | Kartu kadaluarsa | No |
| E7005 | 400 | Invalid plan | Plan tidak valid | No |
| E7006 | 409 | Already subscribed | Sudah berlangganan | No |
| E7007 | 400 | Cannot downgrade | Tidak bisa downgrade | No |
| E7008 | 402 | Budget limit reached | Batas budget tercapai | No |
| E7009 | 500 | Billing system error | Error sistem billing | Yes |
| E7010 | 400 | Stripe webhook invalid | Webhook Stripe tidak valid | No |

### Billing Error Details

```json
// E7008 — Budget limit reached
{
  "success": false,
  "error": {
    "code": "E7008",
    "message": "Budget limit reached",
    "details": {
      "current_usage_usd": 98.50,
      "budget_limit_usd": 100.00,
      "period": "2026-03",
      "action_taken": "downgrade_to_economy",
      "suggestion": "Upgrade budget or wait for next billing period"
    }
  }
}
```

---

## E8xxx — System & Infrastructure

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E8001 | 500 | Internal server error | Error server internal | Yes |
| E8002 | 503 | Service unavailable | Layanan tidak tersedia | Yes |
| E8003 | 503 | Database unavailable | Database tidak tersedia | Yes |
| E8004 | 503 | Cache unavailable | Cache tidak tersedia | Yes |
| E8005 | 503 | Queue unavailable | Queue tidak tersedia | Yes |
| E8006 | 503 | Storage unavailable | Storage tidak tersedia | Yes |
| E8007 | 504 | Request timeout | Request timeout | Yes |
| E8008 | 503 | Under maintenance | Sedang maintenance | Yes |
| E8009 | 500 | Configuration error | Error konfigurasi | No |
| E8010 | 500 | Migration in progress | Migrasi sedang berjalan | Yes |
| E8011 | 503 | Circuit breaker open | Circuit breaker terbuka | Yes |
| E8012 | 500 | Queue job failed | Job queue gagal | Yes |
| E8013 | 500 | Dead letter queue | Job masuk dead letter queue | No |

### System Error with Service Status

```json
// E8002 — Service unavailable
{
  "success": false,
  "error": {
    "code": "E8002",
    "message": "Service unavailable",
    "details": {
      "service": "ai-orchestrator",
      "status": "degraded",
      "reason": "OpenRouter API timeout",
      "estimated_recovery": "2026-03-31T02:15:00Z",
      "fallback": "manual_mode_available"
    }
  }
}
```

---

## E9xxx — Collaboration & Realtime

| Code | HTTP | Message (EN) | Message (ID) | Retryable |
|------|------|--------------|--------------|-----------|
| E9001 | 400 | WebSocket auth failed | Autentikasi WebSocket gagal | No |
| E9002 | 400 | WebSocket connection refused | Koneksi WebSocket ditolak | No |
| E9003 | 400 | Invalid event payload | Payload event tidak valid | No |
| E9004 | 403 | Not workspace member | Bukan anggota workspace | No |
| E9005 | 409 | Concurrent edit conflict | Konflik edit bersamaan | Yes |
| E9006 | 400 | Comment not found | Komentar tidak ditemukan | No |
| E9007 | 403 | Cannot edit others comment | Tidak bisa edit komentar orang lain | No |

---

## 🛠 Client-Side Error Handling

### Error Handler Utility

```typescript
// lib/error-handler.ts

import { ApiError, ErrorCode } from '@karyo/types';

export function handleApiError(error: ApiError): UserFacingError {
  const { code, message, details } = error;

  // Map error codes to user-friendly messages
  const userMessages: Record<string, { title: string; message: string; action?: string; icon: string }> = {
    // Auth
    'E2001': { title: 'Sesi berakhir', message: 'Silakan login kembali', action: 'login', icon: '🔐' },
    'E2002': { title: 'Login gagal', message: 'Email atau password salah', icon: '❌' },
    'E2003': { title: 'Sesi berakhir', message: 'Token sudah kadaluarsa', action: 'refresh', icon: '⏰' },
    'E2006': { title: 'Akses ditolak', message: 'Kamu tidak punya izin untuk aksi ini', icon: '🚫' },

    // Tasks
    'E5001': { title: 'AI sedang berpikir keras...', message: 'Proses memakan waktu lebih lama dari biasanya', icon: '⏳' },
    'E5002': { title: 'AI sedang istirahat', message: 'Mode AI sementara tidak tersedia. Coba mode Manual.', action: 'switch_manual', icon: '🔧' },
    'E5004': { title: 'Agent gagal bekerja', message: 'Coba lagi atau gunakan agent lain', action: 'retry', icon: '🤖' },
    'E5007': { title: 'Agent timeout', message: 'Agent terlalu lama memproses', action: 'retry', icon: '⏰' },
    'E5018': { title: 'Output perlu review', message: 'AI mendeteksi output mungkin tidak akurat', action: 'review', icon: '🔍' },

    // Rate Limit
    'E3001': { title: 'Terlalu cepat!', message: `Coba lagi dalam ${details?.retry_after_seconds || 60} detik`, icon: '🐢' },
    'E3004': { title: 'Storage penuh', message: 'Kuota storage sudah habis. Hapus file atau upgrade plan.', action: 'upgrade', icon: '💾' },

    // Files
    'E4001': { title: 'Tipe file tidak didukung', message: 'Upload file dengan format yang didukung', icon: '📎' },
    'E4002': { title: 'File terlalu besar', message: `Maksimal ukuran file adalah ${details?.max_size || '10MB'}`, icon: '📎' },

    // Billing
    'E3010': { title: 'Budget habis', message: 'Batas budget AI bulanan sudah tercapai', action: 'upgrade', icon: '💰' },
    'E7003': { title: 'Pembayaran gagal', message: 'Kartu ditolak. Update metode pembayaran.', action: 'update_payment', icon: '💳' },

    // System
    'E8001': { title: 'Terjadi kesalahan', message: 'Tim kami sedang menangani. Coba lagi nanti.', icon: '⚠️' },
    'E8002': { title: 'Layanan tidak tersedia', message: 'Sistem sedang maintenance. Coba lagi nanti.', icon: '🔧' },
    'E8011': { title: 'Terlalu banyak permintaan', message: 'Sistem sedang overload. Tunggu sebentar.', icon: '🚦' },

    // Integration
    'E6002': { title: 'Integrasi perlu dihubungkan ulang', message: 'Autentikasi sudah kadaluarsa', action: 'reconnect', icon: '🔌' },
    'E6006': { title: 'Layanan eksternal lambat', message: 'API eksternal sedang rate limited', icon: '⏳' },
  };

  const mapped = userMessages[code] || {
    title: 'Terjadi kesalahan',
    message: message,
    icon: '⚠️',
  };

  return {
    ...mapped,
    code,
    technicalMessage: message,
    details,
    retryable: isRetryable(code),
  };
}

export function isRetryable(code: string): boolean {
  const retryableCodes = [
    'E5001', 'E5002', 'E5003', 'E5004', 'E5007',
    'E5011', 'E5012', 'E5013',
    'E6001', 'E6004', 'E6006', 'E6007', 'E6008',
    'E8001', 'E8002', 'E8003', 'E8004', 'E8005', 'E8006', 'E8007', 'E8011', 'E8012',
    'E3001', 'E3002', 'E3003', 'E3005', 'E3006', 'E3008', 'E3009',
  ];
  return retryableCodes.includes(code);
}

export function getRetryDelay(code: string, attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  const baseDelay = 1000;
  const maxDelay = 30000;
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  
  // Add jitter (±20%)
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}
```

### React Error Boundary

```tsx
// components/ErrorBoundary.tsx

import { Component, ReactNode } from 'react';
import { handleApiError } from '@/lib/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const handled = this.state.error?.code
        ? handleApiError(this.state.error)
        : { title: 'Terjadi kesalahan', message: 'Silakan refresh halaman', icon: '⚠️' };

      return this.props.fallback || (
        <div className="error-fallback">
          <span className="icon">{handled.icon}</span>
          <h2>{handled.title}</h2>
          <p>{handled.message}</p>
          {handled.retryable && (
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Coba Lagi
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 📊 Error Monitoring Dashboard

```
┌─────────────────────────────────────────────┐
│  ⚠️  Error Monitor — Last 24h              │
├─────────────────────────────────────────────┤
│                                             │
│  Total Errors: 234                          │
│  Unique Codes: 18                           │
│  Affected Users: 45                         │
│                                             │
│  Top Errors:                                │
│  ├── E5001 (AI timeout):      89 (38%)     │
│  ├── E3001 (Rate limit):      56 (24%)     │
│  ├── E2003 (Token expired):   34 (15%)     │
│  ├── E4006 (Upload failed):   23 (10%)     │
│  └── E6006 (External RL):     18 (8%)      │
│                                             │
│  Error Trend:                               │
│  ████████░░░░ 00:00                         │
│  ██████████░░ 06:00                         │
│  ████████████ 12:00                         │
│  ████████░░░░ 18:00                         │
│                                             │
│  [View Details] [Export] [Alert Config]     │
└─────────────────────────────────────────────┘
```

---

## 🧪 Testing Error Codes

```typescript
// __tests__/errors.test.ts

describe('Error Codes', () => {
  it('should return E0001 for invalid input', async () => {
    const res = await api.post('/api/v1/tasks', { title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('E0001');
  });

  it('should return E2001 for missing auth', async () => {
    const res = await api.get('/api/v1/tasks');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('E2001');
  });

  it('should return E3001 with retry headers', async () => {
    // Make rapid requests
    for (let i = 0; i < 130; i++) {
      await api.get('/api/v1/health');
    }
    const res = await api.get('/api/v1/health');
    expect(res.status).toBe(429);
    expect(res.body.error.code).toBe('E3001');
    expect(res.headers['retry-after']).toBeDefined();
  });

  it('should return E1004 for non-existent task', async () => {
    const res = await api.get('/api/v1/tasks/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('E1004');
  });
});
```

---

**🚀 Error handling yang konsisten = Developer experience yang lebih baik!**
