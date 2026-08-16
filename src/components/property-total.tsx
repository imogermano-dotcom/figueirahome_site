"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function PropertyTotal({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    void supabase
      .from("imoveis")
      .select("imovel_ref", { count: "exact", head: true })
      .eq("publicado", true)
      .eq("disponibilidade", "Disponível")
      .then(({ count: publicCount, error }) => {
        if (!error && typeof publicCount === "number") setCount(publicCount);
      });
  }, []);

  return <>{count}</>;
}
