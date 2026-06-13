import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const sb = createClient(
  "https://esylzsacjkimcqxllhwd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzeWx6c2FjamtpbWNxeGxsaHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDE3MzEsImV4cCI6MjA5NTY3NzczMX0.3BZsEh6IaFqKHsW9MX3mhxWbvSHEcAqKhyOrJFZGAoA"
);

const ADMIN_EMAIL = "contact@tayafitness.com";

const COLORS = {
  bg: "#0d1b2a", bgCard: "#16273a", bgSoft: "#122033",
  gold: "#ff6b4a", goldLight: "#ff8c70",
  white: "#f0f4f8", muted: "rgba(220,232,244,0.55)",
  border: "rgba(255,255,255,0.07)",
  green: "#3ecf8e", red: "#ff4d6a", blue: "#4d9fff",
};

const S = {
  app: { background: COLORS.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: COLORS.white },
  card: { background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "24px" },
  btn: { background: `linear-gradient(135deg, ${COLORS.gold}, #e5432f)`, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  btnOutline: { background: "transparent", color: COLORS.gold, border: `1.5px solid ${COLORS.gold}`, borderRadius: 10, padding: "10px 20px", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  input: { background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.white, padding: "12px 16px", fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box" },
  label: { fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: COLORS.gold },
  stat: { background: COLORS.bgSoft, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px", flex: 1 },
  badge: (color) => ({ background: `${color}22`, color, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 100, display: "inline-block" }),
  th: { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.muted, borderBottom: `1px solid ${COLORS.border}` },
  td: { padding: "14px 16px", fontSize: 14, color: COLORS.white, borderBottom: `1px solid ${COLORS.border}` },
};

// ── LOGIN ────────────────────────────────────────────────────────────────────
function Login() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loginGoogle() {
    setLoading(true); setErr("");
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) { setErr("Erreur de connexion. Réessaie."); setLoading(false); }
  }

  return (
    <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: COLORS.white }}>Taya</span>
            <span style={{ color: COLORS.gold }}>CRM</span>
          </div>
          <p style={{ color: COLORS.muted, marginTop: 8, fontSize: 14 }}>Espace de gestion — Sarah Paulmier</p>
        </div>
        <div style={S.card}>
          <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24, textAlign: "center" }}>
            Connecte-toi avec ton compte Google pour accéder au CRM.
          </p>
          {err && <div style={{ background: `${COLORS.red}22`, color: COLORS.red, padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{err}</div>}
          <button onClick={loginGoogle} disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.bgSoft, color: COLORS.white, fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {loading ? "Connexion..." : "Continuer avec Google"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "clients", icon: "👥", label: "Clients" },
  { id: "abonnements", icon: "💳", label: "Abonnements" },
  { id: "programmes", icon: "🏋️", label: "Programmes" },
  { id: "emails", icon: "📧", label: "Campagnes mail" },
  { id: "messages", icon: "💬", label: "Messages" },
  { id: "revenus", icon: "💰", label: "Revenus" },
  { id: "taches", icon: "✅", label: "Tâches" },
];

function Sidebar({ active, setActive, onLogout }) {
  return (
    <div style={{ width: 220, background: COLORS.bgSoft, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 }}>
      <div style={{ padding: "28px 20px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          <span style={{ color: COLORS.white }}>Taya</span>
          <span style={{ color: COLORS.gold }}>CRM</span>
        </div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Tableau de bord</div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10, border: "none", background: active === t.id ? `rgba(255,107,74,0.12)` : "transparent", color: active === t.id ? COLORS.gold : COLORS.muted, fontWeight: active === t.id ? 600 : 400, fontSize: 14, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.15s" }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 10px", borderTop: `1px solid ${COLORS.border}` }}>
        <button onClick={onLogout} style={{ ...S.btnOutline, width: "100%", fontSize: 13 }}>Déconnexion</button>
      </div>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState({ clients: 0, actifs: 0, revenus: 0, newsletter: 0 });
  const [recentClients, setRecentClients] = useState([]);
  const [abos, setAbos] = useState([]);

  useEffect(() => {
    async function load() {
      const [{ count: clients }, { count: actifs }, { count: newsletter }, { data: aboData }, { data: recent }] = await Promise.all([
        sb.from("profiles").select("*", { count: "exact", head: true }),
        sb.from("abonnements").select("*", { count: "exact", head: true }).eq("statut", "active"),
        sb.from("newsletter").select("*", { count: "exact", head: true }),
        sb.from("abonnements").select("plan, montant_mensuel").eq("statut", "active"),
        sb.from("profiles").select("full_name, created_at, email").order("created_at", { ascending: false }).limit(5),
      ]);
      const revenus = (aboData || []).reduce((s, a) => s + (a.plan === "starter" ? 49 : a.plan === "performance" ? 99 : 199), 0);
      setStats({ clients: clients || 0, actifs: actifs || 0, revenus, newsletter: newsletter || 0 });
      setRecentClients(recent || []);
    }
    load();
  }, []);

  const STAT_CARDS = [
    { label: "Clients total", value: stats.clients, icon: "👥", color: COLORS.blue },
    { label: "Abonnés actifs", value: stats.actifs, icon: "💳", color: COLORS.green },
    { label: "Revenus MRR", value: `${stats.revenus}€`, icon: "💰", color: COLORS.gold },
    { label: "Newsletter", value: stats.newsletter, icon: "📧", color: "#b48cff" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: COLORS.muted, marginBottom: 32, fontSize: 14 }}>Vue d'ensemble de ton activité</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        {STAT_CARDS.map(c => (
          <div key={c.label} style={S.stat}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.card }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Derniers clients inscrits</h3>
        {recentClients.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Aucun client pour l'instant.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={S.th}>Nom</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Inscrit le</th>
            </tr></thead>
            <tbody>{recentClients.map((c, i) => (
              <tr key={i}>
                <td style={S.td}>{c.full_name || "—"}</td>
                <td style={{ ...S.td, color: COLORS.muted }}>{c.email || "—"}</td>
                <td style={{ ...S.td, color: COLORS.muted }}>{c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "—"}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── CLIENTS ──────────────────────────────────────────────────────────────────
function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await sb.from("profiles").select("*, abonnements(plan, statut)").order("created_at", { ascending: false });
      setClients(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = clients.filter(c =>
    (c.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const planColor = { starter: COLORS.blue, performance: COLORS.gold, vip: "#b48cff" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Clients</h1>
          <p style={{ color: COLORS.muted, fontSize: 14 }}>{clients.length} clients enregistrés</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input style={S.input} placeholder="🔍 Rechercher par nom ou email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={S.card}>
        {loading ? <p style={{ color: COLORS.muted }}>Chargement...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={S.th}>Client</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Abonnement</th>
              <th style={S.th}>Statut</th>
              <th style={S.th}>Inscrit le</th>
            </tr></thead>
            <tbody>{filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ ...S.td, textAlign: "center", color: COLORS.muted }}>Aucun client trouvé</td></tr>
            ) : filtered.map((c, i) => {
              const abo = c.abonnements?.[0];
              return (
                <tr key={i}>
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, #e5432f)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {(c.full_name || "?")[0].toUpperCase()}
                      </div>
                      <span>{c.full_name || "Sans nom"}</span>
                    </div>
                  </td>
                  <td style={{ ...S.td, color: COLORS.muted }}>{c.email || "—"}</td>
                  <td style={S.td}>
                    {abo ? <span style={S.badge(planColor[abo.plan] || COLORS.muted)}>{abo.plan}</span> : <span style={{ color: COLORS.muted }}>—</span>}
                  </td>
                  <td style={S.td}>
                    {abo ? (
                      <span style={S.badge(abo.statut === "active" ? COLORS.green : COLORS.red)}>
                        {abo.statut === "active" ? "Actif" : abo.statut}
                      </span>
                    ) : <span style={{ color: COLORS.muted }}>—</span>}
                  </td>
                  <td style={{ ...S.td, color: COLORS.muted }}>{c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "—"}</td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── ABONNEMENTS ──────────────────────────────────────────────────────────────
function Abonnements() {
  const [abos, setAbos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const { data } = await sb.from("abonnements").select("*, profiles(full_name, email)").order("created_at", { ascending: false });
      setAbos(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = abos.filter(a => filter === "all" || a.statut === filter);
  const planColor = { starter: COLORS.blue, performance: COLORS.gold, vip: "#b48cff" };
  const counts = { all: abos.length, active: abos.filter(a => a.statut === "active").length, cancelled: abos.filter(a => a.statut === "cancelled").length, past_due: abos.filter(a => a.statut === "past_due").length };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Abonnements</h1>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Gestion des abonnements en cours</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {[["all", "Tous", COLORS.white], ["active", "Actifs", COLORS.green], ["past_due", "En retard", COLORS.gold], ["cancelled", "Annulés", COLORS.red]].map(([v, l, c]) => (
          <button key={v} onClick={() => setFilter(v)}
            style={{ ...S.btnOutline, borderColor: filter === v ? c : COLORS.border, color: filter === v ? c : COLORS.muted, fontSize: 13, padding: "8px 16px" }}>
            {l} ({counts[v] || 0})
          </button>
        ))}
      </div>

      <div style={S.card}>
        {loading ? <p style={{ color: COLORS.muted }}>Chargement...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={S.th}>Client</th>
              <th style={S.th}>Plan</th>
              <th style={S.th}>Statut</th>
              <th style={S.th}>Période en cours</th>
              <th style={S.th}>Renouvellement</th>
            </tr></thead>
            <tbody>{filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ ...S.td, textAlign: "center", color: COLORS.muted }}>Aucun abonnement</td></tr>
            ) : filtered.map((a, i) => (
              <tr key={i}>
                <td style={S.td}>
                  <div>{a.profiles?.full_name || "Sans nom"}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{a.profiles?.email}</div>
                </td>
                <td style={S.td}><span style={S.badge(planColor[a.plan] || COLORS.muted)}>{a.plan}</span></td>
                <td style={S.td}><span style={S.badge(a.statut === "active" ? COLORS.green : a.statut === "past_due" ? COLORS.gold : COLORS.red)}>{a.statut}</span></td>
                <td style={{ ...S.td, color: COLORS.muted, fontSize: 13 }}>
                  {a.current_period_start ? new Date(a.current_period_start).toLocaleDateString("fr-FR") : "—"}
                </td>
                <td style={{ ...S.td, color: COLORS.muted, fontSize: 13 }}>
                  {a.current_period_end ? new Date(a.current_period_end).toLocaleDateString("fr-FR") : "—"}
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── PROGRAMMES ───────────────────────────────────────────────────────────────
function Programmes() {
  const [progs, setProgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ titre: "", description_courte: "", prix: "", categorie: "fitness", niveau: "debutant" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await sb.from("programmes").select("*").order("created_at", { ascending: false });
    setProgs(data || []);
    setLoading(false);
  }

  async function toggleActif(id, actif) {
    await sb.from("programmes").update({ actif: !actif }).eq("id", id);
    load();
  }

  async function saveNew(e) {
    e.preventDefault();
    setSaving(true);
    await sb.from("programmes").insert({ ...form, prix: parseFloat(form.prix), actif: true, slug: form.titre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") });
    setForm({ titre: "", description_courte: "", prix: "", categorie: "fitness", niveau: "debutant" });
    setMsg("Programme créé ✓");
    setTimeout(() => setMsg(""), 3000);
    setSaving(false);
    load();
  }

  const niveauColor = { debutant: COLORS.green, intermediaire: COLORS.gold, avance: COLORS.red };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Programmes</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div style={S.card}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Créer un programme</h3>
          <form onSubmit={saveNew}>
            {[["Titre", "titre", "text", "Ex: Programme perte de poids"], ["Prix (€)", "prix", "number", "49"]].map(([l, k, t, ph]) => (
              <div key={k} style={{ marginBottom: 16 }}>
                <div style={{ ...S.label, marginBottom: 6 }}>{l}</div>
                <input style={S.input} type={t} placeholder={ph} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} required />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <div style={{ ...S.label, marginBottom: 6 }}>Description courte</div>
              <textarea style={{ ...S.input, resize: "vertical" }} rows={3} value={form.description_courte} onChange={e => setForm(f => ({ ...f, description_courte: e.target.value }))} placeholder="Résumé en 1-2 lignes..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ ...S.label, marginBottom: 6 }}>Catégorie</div>
                <select style={S.input} value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
                  {["fitness", "nutrition", "grossesse", "post-partum", "musculation", "perte-de-poids"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{ ...S.label, marginBottom: 6 }}>Niveau</div>
                <select style={S.input} value={form.niveau} onChange={e => setForm(f => ({ ...f, niveau: e.target.value }))}>
                  {["debutant", "intermediaire", "avance"].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            {msg && <div style={{ color: COLORS.green, fontSize: 13, marginBottom: 12 }}>{msg}</div>}
            <button style={S.btn} disabled={saving}>{saving ? "Création..." : "Créer le programme"}</button>
          </form>
        </div>

        <div style={S.card}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Programmes existants ({progs.length})</h3>
          {loading ? <p style={{ color: COLORS.muted }}>Chargement...</p> : progs.length === 0 ? (
            <p style={{ color: COLORS.muted, fontSize: 14 }}>Aucun programme créé.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
              {progs.map((p, i) => (
                <div key={i} style={{ background: COLORS.bg, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.titre}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <span style={S.badge(niveauColor[p.niveau] || COLORS.muted)}>{p.niveau}</span>
                      <span style={{ color: COLORS.gold, fontSize: 13, fontWeight: 600 }}>{p.prix}€</span>
                    </div>
                  </div>
                  <button onClick={() => toggleActif(p.id, p.actif)}
                    style={{ ...S.btnOutline, fontSize: 12, padding: "6px 14px", borderColor: p.actif ? COLORS.green : COLORS.red, color: p.actif ? COLORS.green : COLORS.red }}>
                    {p.actif ? "Actif" : "Inactif"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── EMAILS ───────────────────────────────────────────────────────────────────
function Emails() {
  const [subscribers, setSubscribers] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function load() {
      const [{ data: subs }, { data: lg }] = await Promise.all([
        sb.from("newsletter").select("email, created_at").order("created_at", { ascending: false }),
        sb.from("email_log").select("*").order("created_at", { ascending: false }).limit(10),
      ]);
      setSubscribers(subs || []);
      setLogs(lg || []);
    }
    load();
  }, []);

  async function sendCampaign(e) {
    e.preventDefault();
    setSending(true);
    await sb.from("email_log").insert({ subject, body, recipients: subscribers.length, statut: "sent", created_at: new Date().toISOString() });
    setMsg(`Campagne "${subject}" enregistrée — ${subscribers.length} destinataires`);
    setSubject(""); setBody("");
    setSending(false);
    setTimeout(() => setMsg(""), 5000);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Campagnes mail</h1>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>{subscribers.length} abonnés à la newsletter</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={S.card}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Nouvelle campagne</h3>
          <form onSubmit={sendCampaign}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ ...S.label, marginBottom: 6 }}>Objet de l'email</div>
              <input style={S.input} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Ex: Nouveaux programmes disponibles 🔥" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ ...S.label, marginBottom: 6 }}>Corps du message</div>
              <textarea style={{ ...S.input, resize: "vertical" }} rows={8} value={body} onChange={e => setBody(e.target.value)} placeholder="Bonjour,&#10;&#10;Écris ton message ici..." required />
            </div>
            <div style={{ background: `rgba(255,107,74,0.08)`, border: `1px solid rgba(255,107,74,0.2)`, borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: COLORS.muted }}>
              📬 Sera envoyé à <strong style={{ color: COLORS.white }}>{subscribers.length} abonnés</strong>
            </div>
            {msg && <div style={{ color: COLORS.green, fontSize: 13, marginBottom: 12 }}>{msg}</div>}
            <button style={S.btn} disabled={sending || subscribers.length === 0}>{sending ? "Envoi..." : "Envoyer la campagne"}</button>
          </form>
        </div>

        <div style={S.card}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Derniers abonnés</h3>
          <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 24 }}>
            {subscribers.slice(0, 20).map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                <span style={{ color: COLORS.white }}>{s.email}</span>
                <span style={{ color: COLORS.muted }}>{new Date(s.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
            ))}
            {subscribers.length === 0 && <p style={{ color: COLORS.muted, fontSize: 14 }}>Aucun abonné pour l'instant.</p>}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Historique campagnes</h3>
          {logs.length === 0 ? <p style={{ color: COLORS.muted, fontSize: 14 }}>Aucune campagne envoyée.</p> : logs.map((l, i) => (
            <div key={i} style={{ background: COLORS.bg, borderRadius: 8, padding: "12px 14px", marginBottom: 8, border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{l.subject}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{l.recipients} destinataires · {new Date(l.created_at).toLocaleDateString("fr-FR")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── REVENUS ──────────────────────────────────────────────────────────────────
function Revenus() {
  const [abos, setAbos] = useState([]);
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: a }, { data: ac }] = await Promise.all([
        sb.from("abonnements").select("plan, statut, created_at").eq("statut", "active"),
        sb.from("achats").select("montant, created_at, statut").eq("statut", "active").order("created_at", { ascending: false }).limit(20),
      ]);
      setAbos(a || []);
      setAchats(ac || []);
      setLoading(false);
    }
    load();
  }, []);

  const planPrix = { starter: 49, performance: 99, vip: 199 };
  const mrr = abos.reduce((s, a) => s + (planPrix[a.plan] || 0), 0);
  const arr = mrr * 12;
  const totalAchats = achats.reduce((s, a) => s + (a.montant || 0), 0);
  const countByPlan = { starter: 0, performance: 0, vip: 0 };
  abos.forEach(a => { if (countByPlan[a.plan] !== undefined) countByPlan[a.plan]++; });

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Revenus</h1>
      {loading ? <p style={{ color: COLORS.muted }}>Chargement...</p> : (
        <>
          <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
            {[
              { label: "MRR (mensuel récurrent)", value: `${mrr}€`, color: COLORS.green },
              { label: "ARR (annuel projeté)", value: `${arr}€`, color: COLORS.blue },
              { label: "Ventes programmes", value: `${totalAchats.toFixed(0)}€`, color: COLORS.gold },
              { label: "Abonnés actifs", value: abos.length, color: "#b48cff" },
            ].map(s => (
              <div key={s.label} style={S.stat}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={S.card}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Répartition par plan</h3>
              {[["starter", COLORS.blue, 49], ["performance", COLORS.gold, 99], ["vip", "#b48cff", 199]].map(([plan, color, prix]) => (
                <div key={plan} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, textTransform: "capitalize" }}>{plan}</span>
                    <span style={{ fontSize: 14, color: COLORS.muted }}>{countByPlan[plan]} × {prix}€ = <strong style={{ color }}>{countByPlan[plan] * prix}€/mois</strong></span>
                  </div>
                  <div style={{ background: COLORS.border, borderRadius: 100, height: 6 }}>
                    <div style={{ background: color, borderRadius: 100, height: 6, width: mrr > 0 ? `${(countByPlan[plan] * prix / mrr * 100)}%` : "0%", transition: "width 0.5s" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Derniers achats programmes</h3>
              {achats.length === 0 ? <p style={{ color: COLORS.muted, fontSize: 14 }}>Aucun achat.</p> : achats.map((a, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                  <span style={{ color: COLORS.white }}>{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
                  <span style={{ color: COLORS.gold, fontWeight: 600 }}>{a.montant}€</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── TÂCHES ───────────────────────────────────────────────────────────────────
function Taches() {
  const [taches, setTaches] = useState([]);
  const [newTache, setNewTache] = useState("");
  const [priorite, setPriorite] = useState("normale");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await sb.from("taches").select("*").order("created_at", { ascending: false });
    setTaches(data || []);
  }

  async function add(e) {
    e.preventDefault();
    if (!newTache.trim()) return;
    await sb.from("taches").insert({ titre: newTache, statut: "todo", priorite });
    setNewTache("");
    load();
  }

  async function toggle(id, done) {
    await sb.from("taches").update({ statut: done ? "todo" : "done" }).eq("id", id);
    load();
  }

  async function del(id) {
    await sb.from("taches").delete().eq("id", id);
    load();
  }

  const priColor = { haute: COLORS.red, normale: COLORS.gold, basse: COLORS.blue };
  const todo = taches.filter(t => t.statut !== "done");
  const done = taches.filter(t => t.statut === "done");

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Tâches</h1>

      <div style={{ ...S.card, marginBottom: 24 }}>
        <form onSubmit={add} style={{ display: "flex", gap: 12 }}>
          <input style={{ ...S.input, flex: 1 }} value={newTache} onChange={e => setNewTache(e.target.value)} placeholder="Nouvelle tâche..." />
          <select style={{ ...S.input, width: 140 }} value={priorite} onChange={e => setPriorite(e.target.value)}>
            <option value="haute">🔴 Haute</option>
            <option value="normale">🟡 Normale</option>
            <option value="basse">🔵 Basse</option>
          </select>
          <button style={S.btn}>Ajouter</button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={S.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>À faire ({todo.length})</h3>
          {todo.length === 0 ? <p style={{ color: COLORS.muted, fontSize: 14 }}>Tout est fait 🎉</p> : todo.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <button onClick={() => toggle(t.id, false)} style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${COLORS.border}`, background: "transparent", cursor: "pointer", flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 14 }}>{t.titre}</span>
              <span style={S.badge(priColor[t.priorite] || COLORS.muted)}>{t.priorite}</span>
              <button onClick={() => del(t.id)} style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Terminées ({done.length})</h3>
          {done.length === 0 ? <p style={{ color: COLORS.muted, fontSize: 14 }}>Aucune tâche terminée.</p> : done.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <button onClick={() => toggle(t.id, true)} style={{ width: 20, height: 20, borderRadius: 4, border: "none", background: COLORS.green, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>✓</button>
              <span style={{ flex: 1, fontSize: 14, textDecoration: "line-through", color: COLORS.muted }}>{t.titre}</span>
              <button onClick={() => del(t.id)} style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MESSAGES ─────────────────────────────────────────────────────────────────
function Messages() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await sb.from("contacts").select("*").order("created_at", { ascending: false });
      setContacts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Messages</h1>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Formulaires de contact reçus</p>
      <div style={S.card}>
        {loading ? <p style={{ color: COLORS.muted }}>Chargement...</p> : contacts.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Aucun message reçu.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={S.th}>Nom</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Sujet</th>
              <th style={S.th}>Message</th>
              <th style={S.th}>Date</th>
            </tr></thead>
            <tbody>{contacts.map((c, i) => (
              <tr key={i}>
                <td style={S.td}>{c.prenom} {c.nom}</td>
                <td style={{ ...S.td, color: COLORS.muted }}>{c.email}</td>
                <td style={S.td}><span style={S.badge(COLORS.blue)}>{c.sujet || "—"}</span></td>
                <td style={{ ...S.td, color: COLORS.muted, maxWidth: 200 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</div>
                </td>
                <td style={{ ...S.td, color: COLORS.muted, fontSize: 12 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "—"}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === ADMIN_EMAIL) setUser(session.user);
      setChecking(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      if (session?.user?.email === ADMIN_EMAIL) setUser(session.user);
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: COLORS.muted }}>Chargement...</div></div>;
  if (!user) return <Login />;

  const PAGES = { dashboard: Dashboard, clients: Clients, abonnements: Abonnements, programmes: Programmes, emails: Emails, messages: Messages, revenus: Revenus, taches: Taches };
  const Page = PAGES[active] || Dashboard;

  return (
    <div style={{ ...S.app, display: "flex" }}>
      <Sidebar active={active} setActive={setActive} onLogout={() => sb.auth.signOut()} />
      <main style={{ flex: 1, padding: "40px", overflowY: "auto", maxHeight: "100vh" }}>
        <Page />
      </main>
    </div>
  );
}
