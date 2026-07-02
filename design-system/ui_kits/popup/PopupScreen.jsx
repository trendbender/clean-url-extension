/* global React */
/**
 * The assembled Clean URL popup — the full 360px browser-action surface,
 * composed entirely from design-system components.
 *
 * Loaded via Babel in index.html; reads DS components from the global namespace
 * and exposes itself as window.PopupScreen.
 *
 * scenario: "empty" | "cleaned" | "copied"
 */
function PopupScreen({ scenario = "cleaned", logoSrc = "../../assets/logo-cu.svg" }) {
  const { BrandRow, Card, UrlField, Toggle, Button, RemovedHint, StatusLine } =
    window.CleanURLDesignSystem_814f5d;

  const DIRTY =
    "https://example.com/article?utm_source=newsletter&utm_medium=email&utm_campaign=spring&gclid=Cj0KxAryZ&fbclid=IwAR2x";
  const CLEAN = "https://example.com/article";

  const isEmpty = scenario === "empty";
  const original = isEmpty ? "" : DIRTY;
  const clean = isEmpty ? "" : CLEAN;
  const removed = isEmpty ? 0 : 5;

  const [rules, setRules] = React.useState({ utm: true, click: true, ref: true, frag: true });
  const [status, setStatus] = React.useState(
    scenario === "copied"
      ? { kind: "success", msg: "Copied clean URL" }
      : { kind: "neutral", msg: "" }
  );

  const set = (k) => (v) => setRules((r) => ({ ...r, [k]: v }));

  const shell = {
    width: "360px",
    background: "var(--backdrop)",
    color: "var(--text)",
    fontFamily: "var(--font)",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
  };

  return (
    <div style={shell}>
      <header style={{ padding: "14px 14px 10px" }}>
        <BrandRow logoSrc={logoSrc} />
      </header>

      <main style={{ padding: "0 14px 14px" }}>
        <Card style={{ marginBottom: "10px" }}>
          <UrlField label="Original URL" value={original} />
        </Card>

        <Card style={{ marginBottom: "10px" }}>
          <UrlField label="Clean URL" value={clean} />
          <RemovedHint count={removed} />
        </Card>

        <Card style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "13px", fontWeight: 650, marginBottom: "8px" }}>Cleaning rules</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Toggle label="Remove UTM (utm_*)" checked={rules.utm} onChange={set("utm")} />
            <Toggle label="Remove click IDs (gclid, fbclid, …)" checked={rules.click} onChange={set("click")} />
            <Toggle label="Remove ref/tracking (ref, igshid, mc_*, …)" checked={rules.ref} onChange={set("ref")} />
            <Toggle label="Remove text fragments (#:~:text=)" checked={rules.frag} onChange={set("frag")} />
          </div>
        </Card>

        <section>
          <Button variant="primary" disabled={isEmpty}
            onClick={() => setStatus({ kind: "success", msg: "Copied clean URL" })}>
            Copy Clean
          </Button>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <Button variant="ghost" disabled={isEmpty}
              onClick={() => setStatus({ kind: "success", msg: "Copied original URL" })}>
              Copy Original
            </Button>
            <Button variant="ghost" disabled={isEmpty}>Open Clean</Button>
          </div>
          <StatusLine kind={status.kind}>{status.msg}</StatusLine>
        </section>
      </main>
    </div>
  );
}

window.PopupScreen = PopupScreen;
