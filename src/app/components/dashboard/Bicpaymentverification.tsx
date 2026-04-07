/**
 * BicPaymentVerification.tsx
 * ─────────────────────────────────────────────────────────────────
 * Drop this page at your redirectUrl route, e.g. /payment/verify
 *
 * GlobalPay appends these params after checkout:
 *   ?merchantRef=BIC_20260323_xxxx&status=successful
 *
 * This component:
 *  1. Reads merchantRef from the URL
 *  2. Calls POST /api/BicAuth/verify/{merchantRef} with retry logic
 *  3. Shows live status feedback to the user
 *  4. Redirects to dashboard on success
 * ─────────────────────────────────────────────────────────────────
 */
"use client";
import { useEffect, useState, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────
type VerifyStatus = "loading" | "success" | "failed" | "timeout" | "missing";

interface VerifyResponse {
  merchantRef: string;
  currentStatus: "Success" | "Failed" | "Pending";
  globalPayRef: string;
  periodStart: string | null;
  periodEnd: string | null;
  timestamp: string;
}

// ── Config — update these to match your project ─────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://your-api.com";
const DASHBOARD_URL = "/dashboard";
const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 3000; // 3s between retries (GlobalPay needs time to settle)

// ── Helper ───────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

function getToken(): string | null {
  // Adjust to wherever you store the JWT (localStorage, cookie, context, etc.)
  return localStorage.getItem("bic_token");
}

/**
 * Extracts merchantRef from URL params.
 * GlobalPay may use different param names — we try all known variants.
 */
function getMerchantRef(): string | null {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("merchantRef") ??
    params.get("MerchantTransactionreference") ??
    params.get("txRef") ??
    params.get("reference") ??
    null
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function BicPaymentVerification() {
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [attemptCount, setAttemptCount] = useState(0);
  const [merchantRef, setMerchantRef] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string>("");

  // ── Core verify logic with retry ──────────────────────────────
  const verifyPayment = useCallback(async (ref: string) => {
    const token = getToken();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      setAttemptCount(attempt);

      // Give GlobalPay time to settle on first call
      if (attempt > 1) await sleep(RETRY_DELAY_MS);

      try {
        const res = await fetch(`${API_BASE}/api/BicAuth/verify/${ref}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          setErrorDetail(`Server returned ${res.status}`);
          continue; // retry
        }

        const data: VerifyResponse = await res.json();

        if (data.currentStatus === "Success") {
          setPeriodEnd(data.periodEnd);
          setStatus("success");
          // Redirect to dashboard after 3s so user can read the success message
          setTimeout(() => {
            window.location.href = DASHBOARD_URL;
          }, 3000);
          return;
        }

        if (data.currentStatus === "Failed") {
          setStatus("failed");
          return;
        }

        // Still Pending — loop and retry
        setErrorDetail(`Attempt ${attempt}/${MAX_RETRIES}: payment still processing…`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error";
        setErrorDetail(`Attempt ${attempt}/${MAX_RETRIES}: ${msg}`);
      }
    }

    // All retries exhausted
    setStatus("timeout");
  }, []);

  // ── On mount: read ref and start verify ──────────────────────
  useEffect(() => {
    const ref = getMerchantRef();

    if (!ref) {
      setStatus("missing");
      return;
    }

    setMerchantRef(ref);
    verifyPayment(ref);
  }, [verifyPayment]);

  // ── Format date helper ────────────────────────────────────────
  function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* AEGC Header */}
        <div style={styles.header}>
          <div style={styles.logoMark}>🏢</div>
          <p style={styles.headerLabel}>BIC Platform · Payment Verification</p>
        </div>

        {/* ── Loading state ── */}
        {status === "loading" && (
          <div style={styles.body}>
            <Spinner />
            <h2 style={styles.titlePrimary}>Verifying your payment…</h2>
            <p style={styles.bodyText}>
              Please wait while we confirm your subscription with GlobalPay.
            </p>
            {attemptCount > 1 && (
              <div style={styles.infoBox}>
                <span style={styles.infoIcon}>⏳</span>
                <p style={styles.infoText}>{errorDetail}</p>
              </div>
            )}
            <p style={styles.subtext}>Do not close or refresh this tab.</p>
          </div>
        )}

        {/* ── Success state ── */}
        {status === "success" && (
          <div style={styles.body}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={{ ...styles.titlePrimary, color: "#1a7a4a" }}>
              Subscription Activated!
            </h2>
            <p style={styles.bodyText}>
              Your BIC Platform subscription is now active.
            </p>
            {periodEnd && (
              <div style={{ ...styles.infoBox, borderLeftColor: "#1a7a4a", background: "#edf7f2" }}>
                <span style={styles.infoIcon}>📅</span>
                <p style={styles.infoText}>
                  <strong>Active until:</strong> {formatDate(periodEnd)}
                </p>
              </div>
            )}
            <p style={styles.subtext}>Redirecting you to your dashboard…</p>
            <a href={DASHBOARD_URL} style={styles.button}>
              Go to Dashboard
            </a>
          </div>
        )}

        {/* ── Failed state ── */}
        {status === "failed" && (
          <div style={styles.body}>
            <div style={styles.failIcon}>✕</div>
            <h2 style={{ ...styles.titlePrimary, color: "#a32d2d" }}>
              Payment Not Successful
            </h2>
            <p style={styles.bodyText}>
              Your payment could not be confirmed. No charge has been applied to
              your subscription.
            </p>
            <div style={{ ...styles.infoBox, borderLeftColor: "#a32d2d", background: "#fdf2f2" }}>
              <span style={styles.infoIcon}>ℹ️</span>
              <p style={styles.infoText}>
                If you believe this is an error, please contact{" "}
                <a href="mailto:support@aegc.com" style={styles.link}>
                  support@aegc.com
                </a>{" "}
                with your reference: <strong>{merchantRef}</strong>
              </p>
            </div>
            <a href="/subscribe" style={{ ...styles.button, background: "#1A3C5E" }}>
              Try Again
            </a>
          </div>
        )}

        {/* ── Timeout state ── */}
        {status === "timeout" && (
          <div style={styles.body}>
            <div style={styles.warningIcon}>⚠</div>
            <h2 style={{ ...styles.titlePrimary, color: "#7a5a00" }}>
              Verification Taking Longer Than Expected
            </h2>
            <p style={styles.bodyText}>
              We could not confirm your payment automatically after{" "}
              {MAX_RETRIES} attempts. This sometimes happens with network delays.
            </p>
            <div style={{ ...styles.infoBox, borderLeftColor: "#e6a817", background: "#fffbea" }}>
              <span style={styles.infoIcon}>📋</span>
              <p style={styles.infoText}>
                <strong>Your reference:</strong> {merchantRef}
                <br />
                Please save this and contact{" "}
                <a href="mailto:support@aegc.com" style={styles.link}>
                  support@aegc.com
                </a>{" "}
                if your subscription does not activate within 15 minutes.
              </p>
            </div>
            <button
              style={{ ...styles.button, background: "#1A3C5E", cursor: "pointer", border: "none" }}
              onClick={() => {
                if (merchantRef) {
                  setStatus("loading");
                  setAttemptCount(0);
                  verifyPayment(merchantRef);
                }
              }}
            >
              Retry Verification
            </button>
          </div>
        )}

        {/* ── Missing ref state ── */}
        {status === "missing" && (
          <div style={styles.body}>
            <div style={styles.warningIcon}>⚠</div>
            <h2 style={{ ...styles.titlePrimary, color: "#7a5a00" }}>
              No Payment Reference Found
            </h2>
            <p style={styles.bodyText}>
              We could not find a payment reference in this URL. If you were
              redirected here after payment, please contact support.
            </p>
            <a href="/subscribe" style={{ ...styles.button, background: "#1A3C5E" }}>
              Return to Subscribe
            </a>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            <strong>All-Encompassing Global Consult Limited</strong>
          </p>
          <p style={styles.footerText}>
            Block 1B, A Avenue, Sparklight Estate, Isheri, Ogun State, Nigeria
          </p>
          <p style={styles.footerText}>
            © {new Date().getFullYear()} All-Encompassing Global Consult Limited.
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Spinner component ─────────────────────────────────────────────
function Spinner() {
  return (
    <div style={styles.spinnerWrap}>
      <div style={styles.spinnerRing} />
    </div>
  );
}

// ── Inline styles (no Tailwind dependency) ────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f4f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Figtree', Arial, sans-serif",
  },
  card: {
    maxWidth: 520,
    width: "100%",
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    overflow: "hidden",
  },
  header: {
    background: "#1A3C5E",
    padding: "28px 30px 22px",
    textAlign: "center",
  },
  logoMark: {
    fontSize: 40,
    marginBottom: 8,
    lineHeight: 1,
  },
  headerLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    margin: 0,
    fontStyle: "italic",
    letterSpacing: "0.04em",
  },
  body: {
    padding: "32px 36px 24px",
    textAlign: "center",
  },
  titlePrimary: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1A3C5E",
    margin: "12px 0 10px",
    lineHeight: 1.3,
  },
  bodyText: {
    fontSize: 11,
    color: "#444",
    lineHeight: 1.7,
    margin: "0 0 16px",
  },
  infoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    background: "#E8F0FA",
    borderLeft: "4px solid #1A3C5E",
    borderRadius: 6,
    padding: "12px 14px",
    textAlign: "left",
    margin: "16px 0",
  },
  infoIcon: {
    fontSize: 14,
    lineHeight: 1.5,
    flexShrink: 0,
  },
  infoText: {
    fontSize: 11,
    color: "#333",
    margin: 0,
    lineHeight: 1.6,
  },
  subtext: {
    fontSize: 10,
    color: "#888",
    fontStyle: "italic",
    margin: "8px 0 16px",
  },
  button: {
    display: "inline-block",
    marginTop: 8,
    padding: "11px 28px",
    background: "#1a7a4a",
    color: "#fff",
    borderRadius: 24,
    fontSize: 11,
    fontWeight: 600,
    textDecoration: "none",
    letterSpacing: "0.02em",
  },
  link: {
    color: "#1A3C5E",
    fontWeight: 600,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#edf7f2",
    border: "2px solid #1a7a4a",
    color: "#1a7a4a",
    fontSize: 26,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 4px",
  },
  failIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#fdf2f2",
    border: "2px solid #a32d2d",
    color: "#a32d2d",
    fontSize: 26,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 4px",
  },
  warningIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#fffbea",
    border: "2px solid #e6a817",
    color: "#7a5a00",
    fontSize: 26,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 4px",
  },
  spinnerWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 4,
  },
  spinnerRing: {
    width: 48,
    height: 48,
    border: "4px solid #e0e8f4",
    borderTop: "4px solid #1A3C5E",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  footer: {
    borderTop: "1px solid #e8e8e8",
    padding: "16px 30px",
    textAlign: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#999",
    fontStyle: "italic",
    margin: "2px 0",
  },
};

// Inject spinner keyframe (once, globally)
if (typeof document !== "undefined" && !document.getElementById("bic-spin-style")) {
  const style = document.createElement("style");
  style.id = "bic-spin-style";
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}