"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Brain,
  CalendarDays,
  Check,
  ClipboardList,
  HeartPulse,
  ListChecks,
  Map,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import BodyMap3D from "@/app/components/body-map-3d/BodyMap3D";
import {
  assessmentItems,
  clinicalLoop,
  mapRegions,
  patient,
  planItems,
  promItems,
  todayActions,
} from "@/app/data/productData";

const sections = [
  { id: "today", label: "Oggi", icon: ListChecks },
  { id: "map", label: "Body map 3D", icon: Map },
  { id: "assessment", label: "Valutazione", icon: ClipboardList },
  { id: "plan", label: "Piano", icon: CalendarDays },
  { id: "monitor", label: "Monitoraggio", icon: Activity },
];

const filterLabels = {
  symptom: "sintomi",
  dysfunction: "disfunzioni",
  trigger: "trigger",
  rom: "ROM",
  strength: "forza",
  history: "storico",
};

const allTypes = Object.keys(filterLabels);

function severityLabel(value) {
  if (value >= 0.75) return "critico";
  if (value >= 0.45) return "moderato";
  return "lieve";
}

function toneClass(value) {
  if (value === "critico") return "tone-high";
  if (value === "moderato") return "tone-mid";
  return "tone-low";
}

function SectionNav({ activeSection, setActiveSection }) {
  return (
    <nav className="section-nav" aria-label="Sezioni app">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <button
            type="button"
            key={section.id}
            className={activeSection === section.id ? "active" : ""}
            onClick={() => setActiveSection(section.id)}
          >
            <Icon size={18} />
            <span>{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function AppHeader({ theme, setTheme }) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark">
          <HeartPulse size={21} />
        </div>
        <div>
          <span>ClinicaOS</span>
          <strong>{patient.name}</strong>
        </div>
      </div>
      <div className="header-actions">
        <div className="search-pill">
          <Search size={16} />
          <span>Cerca paziente</span>
        </div>
        <button
          type="button"
          className="icon-action"
          aria-label="Tema"
          title="Tema"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}

function PatientSummary({ setActiveSection }) {
  return (
    <section className="patient-focus">
      <div>
        <span className="kicker">cartella attiva</span>
        <h1>{patient.reason}</h1>
        <p>{patient.nextStep}</p>
      </div>
      <div className="patient-state">
        <div>
          <span>Stato</span>
          <strong>{patient.status}</strong>
        </div>
        <div>
          <span>Consensi</span>
          <strong>
            <ShieldCheck size={16} />
            attivi
          </strong>
        </div>
        <button type="button" onClick={() => setActiveSection("map")}>
          apri body map
        </button>
      </div>
    </section>
  );
}

function TodayView({ setActiveSection }) {
  return (
    <section className="view-grid today-grid">
      <div className="focus-panel main-task">
        <span className="kicker">prossima cosa utile</span>
        <h2>Rivaluta la zona lombare prima di cambiare il piano.</h2>
        <p>L’app tiene il resto fuori dalla vista finche non serve.</p>
        <button type="button" onClick={() => setActiveSection("map")}>
          vai alla body map 3D
        </button>
      </div>

      <div className="action-stack">
        {todayActions.map((action) => (
          <button type="button" key={action.id} onClick={() => setActiveSection(action.target)}>
            <span>
              <strong>{action.title}</strong>
              <small>{action.detail}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="loop-strip">
        {clinicalLoop.map((item, index) => (
          <button type="button" key={item.id} onClick={() => setActiveSection(item.id === "reason" ? "today" : item.id)}>
            <i>{index + 1}</i>
            <span>
              <strong>{item.label}</strong>
              <small>{item.status}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function BodyMapView({ activeTypes, setActiveTypes, selectedRegionId, setSelectedRegionId }) {
  const selectedRegion = mapRegions.find((region) => region.id === selectedRegionId) || mapRegions[0];
  const activeRegions = useMemo(
    () => mapRegions.filter((region) => activeTypes.has(region.type)),
    [activeTypes]
  );

  function toggleType(type) {
    setActiveTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next.size ? next : new Set([type]);
    });
  }

  return (
    <section className="body-map-module">
      <div className="module-header">
        <div>
          <span className="kicker">modulo body map</span>
          <h2>Atlante 3D del paziente</h2>
        </div>
        <div className="type-filters">
          {allTypes.map((type) => (
            <button
              type="button"
              key={type}
              className={activeTypes.has(type) ? "active" : ""}
              onClick={() => toggleType(type)}
            >
              {filterLabels[type]}
            </button>
          ))}
        </div>
      </div>

      <div className="atlas-layout">
        <BodyMap3D
          regions={mapRegions}
          selectedId={selectedRegionId}
          onSelect={setSelectedRegionId}
          activeTypes={activeTypes}
        />
        <aside className="region-panel">
          <div className="region-current">
            <span>{selectedRegion.group}</span>
            <h3>{selectedRegion.label}</h3>
            <i className={toneClass(severityLabel(selectedRegion.severity))}>
              {severityLabel(selectedRegion.severity)}
            </i>
            <p>{selectedRegion.summary}</p>
            <strong>{selectedRegion.next}</strong>
          </div>

          <div className="region-list">
            {activeRegions.map((region) => {
              const level = severityLabel(region.severity);
              return (
                <button
                  type="button"
                  key={region.id}
                  className={region.id === selectedRegionId ? "active" : ""}
                  onClick={() => setSelectedRegionId(region.id)}
                >
                  <span>
                    <strong>{region.label}</strong>
                    <small>{region.side}</small>
                  </span>
                  <i className={toneClass(level)}>{level}</i>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}

function AssessmentView() {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">valutazione</span>
        <h2>Tre misure, poi aggiorni la mappa.</h2>
      </div>
      <div className="clean-list">
        {assessmentItems.map((item) => (
          <button type="button" key={item.label}>
            <span>
              <strong>{item.label}</strong>
              <small>ultimo valore</small>
            </span>
            <b>{item.value}</b>
            <i className={toneClass(item.state)}>{item.state}</i>
          </button>
        ))}
      </div>
    </section>
  );
}

function PlanView() {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">piano</span>
        <h2>Una settimana alla volta.</h2>
      </div>
      <div className="clean-list">
        {planItems.map((item) => (
          <button type="button" key={`${item.day}-${item.title}`}>
            <span>
              <strong>{item.title}</strong>
              <small>{item.day}</small>
            </span>
            <i>{item.state}</i>
          </button>
        ))}
      </div>
    </section>
  );
}

function MonitorView() {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">monitoraggio</span>
        <h2>Solo i trend che cambiano una decisione.</h2>
      </div>
      <div className="metric-row">
        {promItems.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.trend}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function AssistantPanel() {
  return (
    <aside className="assistant-panel">
      <div>
        <Brain size={18} />
        <span>assistente clinico</span>
      </div>
      <p>La sintesi resta una bozza: conferma prima di salvare.</p>
      <button type="button">
        <Sparkles size={16} />
        prepara sintesi
      </button>
    </aside>
  );
}

function ActiveView(props) {
  if (props.activeSection === "map") return <BodyMapView {...props} />;
  if (props.activeSection === "assessment") return <AssessmentView />;
  if (props.activeSection === "plan" || props.activeSection === "action") return <PlanView />;
  if (props.activeSection === "monitor") return <MonitorView />;
  return <TodayView setActiveSection={props.setActiveSection} />;
}

export default function ClinicalPlatformApp() {
  const [theme, setTheme] = useState("light");
  const [activeSection, setActiveSection] = useState("today");
  const [selectedRegionId, setSelectedRegionId] = useState("lumbar-l4-l5");
  const [activeTypes, setActiveTypes] = useState(() => new Set(allTypes));

  return (
    <div className="app-shell" data-theme={theme}>
      <AppHeader theme={theme} setTheme={setTheme} />
      <PatientSummary setActiveSection={setActiveSection} />
      <div className="work-area">
        <SectionNav activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="active-view">
          <ActiveView
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            activeTypes={activeTypes}
            setActiveTypes={setActiveTypes}
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={setSelectedRegionId}
          />
        </main>
        <AssistantPanel />
      </div>
    </div>
  );
}
