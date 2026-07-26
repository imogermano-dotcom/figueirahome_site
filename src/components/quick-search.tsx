import { Search } from "lucide-react";

export function QuickSearch({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/imoveis" className={compact ? "grid gap-4 md:grid-cols-7" : "container flex flex-wrap items-end gap-4"}>
      <label className="field min-w-[150px] flex-1">
        <span>Referência</span>
        <input name="referencia" type="search" placeholder="Ex.: FH-123" />
      </label>
      {!compact && <h2 className="display-font pb-3 text-lg font-extrabold">Pesquisa Rápida</h2>}
      <SearchField label="Negócio" name="negocio" options={[["comprar", "Comprar"], ["arrendar", "Arrendar"], ["trespassar", "Trespassar"]]} />
      <SearchField label="Localização" name="localizacao" options={[["", "Qualquer zona"], ["Figueira da Foz", "Figueira da Foz"], ["Buarcos", "Buarcos"], ["Quiaios", "Quiaios"], ["Coimbra", "Coimbra"]]} />
      <SearchField label="Tipo" name="tipo" options={[["", "Qualquer tipo"], ["Apartamento", "Apartamento"], ["Moradia", "Moradia"], ["Terreno", "Terreno"], ["Comercial", "Comercial"]]} />
      <SearchField label="Preço máximo" name="preco_max" options={[["", "Sem limite"], ["100000", "100.000 EUR"], ["200000", "200.000 EUR"], ["300000", "300.000 EUR"], ["500000", "500.000 EUR"]]} />
      {compact && <SearchField label="Quartos min." name="quartos_min" options={[["", "Sem mínimo"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]]} />}
      <button className="btn btn-primary min-h-[54px]" type="submit"><Search size={18} /> Pesquisar</button>
    </form>
  );
}

function SearchField({ label, name, options }: { label: string; name: string; options: [string, string][] }) {
  return (
    <label className="field min-w-[150px] flex-1">
      <span>{label}</span>
      <select name={name}>
        {options.map(([value, text]) => <option key={`${name}-${value}`} value={value}>{text}</option>)}
      </select>
    </label>
  );
}
