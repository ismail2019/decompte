import { useEffect, useMemo, useState } from "react";

const ELEMENTS = [
  {
    id: "dalle",
    name: "Dalle pleine",
    ratio: 90,
    range: "80 - 120 kg/m³",
    defaults: { length: 6, width: 4, height: 0.2 },
    labels: {
      length: "Longueur (m)",
      width: "Largeur (m)",
      height: "Épaisseur (m)",
    },
  },
  {
    id: "poutre",
    name: "Poutre",
    ratio: 140,
    range: "120 - 180 kg/m³",
    defaults: { length: 5, width: 0.3, height: 0.5 },
    labels: {
      length: "Longueur (m)",
      width: "Largeur (m)",
      height: "Hauteur (m)",
    },
  },
  {
    id: "poteau",
    name: "Poteau",
    ratio: 180,
    range: "150 - 220 kg/m³",
    defaults: { length: 0.35, width: 0.35, height: 3 },
    labels: {
      length: "Largeur (m)",
      width: "Profondeur (m)",
      height: "Hauteur (m)",
    },
  },
  {
    id: "semelle",
    name: "Semelle isolée",
    ratio: 85,
    range: "70 - 100 kg/m³",
    defaults: { length: 2, width: 2, height: 0.5 },
    labels: {
      length: "Longueur (m)",
      width: "Largeur (m)",
      height: "Épaisseur (m)",
    },
  },
];

const BETON_CLASSES = [
  "B20 (C20/25)",
  "B25 (C25/30)",
  "B30 (C30/37)",
  "B35 (C35/45)",
  "B40 (C40/50)",
];

const CONCRETE_DENSITY = 2400;

export function App() {
  const [selectedElement, setSelectedElement] = useState(ELEMENTS[0]);
  const [dimensions, setDimensions] = useState(selectedElement.defaults);
  const [steelRatio, setSteelRatio] = useState(selectedElement.ratio);
  const [betonClass, setBetonClass] = useState(BETON_CLASSES[1]);

  useEffect(() => {
    setSelectedElement(ELEMENTS[0]);
  }, []);

  useEffect(() => {
    setDimensions(selectedElement.defaults);
    setSteelRatio(selectedElement.ratio);
  }, [selectedElement]);

  const volume = useMemo(() => {
    const v = dimensions.length * dimensions.width * dimensions.height;
    return Number.isFinite(v) ? v : 0;
  }, [dimensions]);

  const steelQuantity = useMemo(() => volume * steelRatio, [volume, steelRatio]);
  const concreteMass = useMemo(() => volume * CONCRETE_DENSITY, [volume]);

  const handleDimensionChange = (key: keyof typeof dimensions) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setDimensions((prev) => ({ ...prev, [key]: value }));
    };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-6 py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Normes marocaines
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Calcul rapide des quantités d'acier et de béton
          </h1>
          <p className="max-w-2xl text-base text-emerald-50 md:text-lg">
            Estimez la quantité d'acier pour les éléments de construction usuels, en
            s'appuyant sur les pratiques courantes au Maroc (BAEL/RPS).
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <section className="flex-1 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Paramètres du projet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Choisissez l'élément, renseignez ses dimensions, puis ajustez le taux
              d'acier selon le niveau de sollicitation.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Élément de construction
                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
                  value={selectedElement.id}
                  onChange={(event) => {
                    const next = ELEMENTS.find((element) => element.id === event.target.value);
                    if (next) {
                      setSelectedElement(next);
                    }
                  }}
                >
                  {ELEMENTS.map((element) => (
                    <option key={element.id} value={element.id}>
                      {element.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Classe de béton
                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
                  value={betonClass}
                  onChange={(event) => setBetonClass(event.target.value)}
                >
                  {BETON_CLASSES.map((beton) => (
                    <option key={beton} value={beton}>
                      {beton}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {(Object.keys(dimensions) as Array<keyof typeof dimensions>).map((key) => (
                <label key={key} className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  {selectedElement.labels[key]}
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={dimensions[key]}
                    onChange={handleDimensionChange(key)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Taux d'acier (kg/m³)
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={steelRatio}
                  onChange={(event) => setSteelRatio(Number(event.target.value))}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">
                  Recommandation: {selectedElement.range}
                </span>
              </label>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Rappel norme</p>
                <p className="mt-2">
                  Les ratios sont indicatifs pour des calculs pré-dimensionnement.
                  Validez toujours avec un bureau d'études et les textes marocains.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Repères usuels (Maroc)</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {ELEMENTS.map((element) => (
                <div
                  key={element.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-800">{element.name}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {element.range} selon les usages courants.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full max-w-lg space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Résultats estimatifs</h2>
            <p className="mt-2 text-sm text-slate-500">
              Résumé du volume de béton et de l'acier selon les données saisies.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Élément</p>
                <p className="mt-1 text-lg font-semibold">{selectedElement.name}</p>
                <p className="mt-1 text-sm text-slate-500">Béton: {betonClass}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Volume</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-700">
                    {volume.toFixed(2)} m³
                  </p>
                  <p className="mt-1 text-xs text-emerald-700/70">
                    Masse béton ≈ {concreteMass.toFixed(0)} kg
                  </p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-600">Acier</p>
                  <p className="mt-2 text-2xl font-semibold text-sky-700">
                    {steelQuantity.toFixed(1)} kg
                  </p>
                  <p className="mt-1 text-xs text-sky-700/70">
                    Taux: {steelRatio} kg/m³
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">Conseil</p>
                <p className="mt-2">
                  Pour un estimatif précis, intégrer les surcharges, les charges
                  d'exploitation et les contraintes sismiques propres au site.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
