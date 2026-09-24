import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Přihlášení do administrace | PneuDepot" },
      { name: "description", content: "Přihlášení pro správce obchodu PneuDepot." },
      { property: "og:title", content: "Přihlášení | PneuDepot" },
      { property: "og:description", content: "Přihlášení pro správce obchodu." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("Přihlášení se nezdařilo: zkontrolujte e-mail a heslo.");
      else navigate({ to: "/admin" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) setMsg(error.message);
      else if (data.session) navigate({ to: "/admin" });
      else setMsg("Účet vytvořen. Potvrďte registraci odkazem v e-mailu a pak se přihlaste.");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-3xl font-bold">{mode === "login" ? "Přihlášení" : "Registrace správce"}</h1>
        <form onSubmit={submit} className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5">
          <input className={inputClass} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inputClass} type="password" required minLength={6} placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={busy} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {mode === "login" ? "Přihlásit" : "Vytvořit účet"}
          </button>
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 text-sm text-primary hover:underline">
          {mode === "login" ? "Nemáte účet? Zaregistrujte se" : "Už máte účet? Přihlaste se"}
        </button>
      </div>
    </div>
  );
}
