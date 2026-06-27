"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  FileText,
  Filter,
  FlaskConical,
  HeartPulse,
  LineChart,
  Map as MapIcon,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Sun,
  Users,
  UserRound,
} from "lucide-react";
import BodyMap, {
  allFilterIds,
  getAreaFindings,
  getAreaSeverity,
  getSelectedArea,
} from "@/app/components/BodyMap";
import {
  aiCards,
  assessmentRows,
  bodyAreaCount,
  bodyRegionCount,
  exerciseRows,
  findings,
  findingFilters,
  loopSteps,
  metrics,
  networkRows,
  patient,
  patients,
  planItems,
  promTrend,
  protocolRows,
  timeline,
} from "@/app/data/clinicalData";

const navItems = [
  { label: "Cartella", icon: UserRound, active: true },
  { label: "Mappa", icon: MapIcon },
  { label: "Assessment", icon: ClipboardList },
  { label: "Piano", icon: CalendarDays },
  { label: "MyLab", icon: FlaskConical },
  { label: "Analytics", icon: LineChart },
  { label: "Network", icon: Users },
];

function toneClass(value) {
  if (value === "alto" || value === "critico") return "tone-high";
  if (value === "medio" || value === "moderato") return "tone-mid";
  return "tone-low";
}

function IconButton({ children, title, onClick, active }) {
  return (
    <button
      type="button"
      className={`icon-button ${active ? "active" : ""}`}
      title={title}
      aria-label={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="mark" aria-label="Clinical loop">
        <HeartPulse size={22} />
      </div>
      <nav className="rail-nav" aria-label="Navigazione principale">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.label}
              className={item.active ? "active" : ""}
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={19} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function PatientStrip() {
  return (
    <section className="patient-strip">
      <div className="patient-main">
        <div className="avatar" aria-hidden="true">
          GR
        </div>
        <div>
          <div className="eyebrow">cartella paziente</div>
          <h1>{patient.name}</h1>
          <p>{patient.summary}</p>
          <div className="tag-row">
            {patient.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="patient-meta">
        <div>
          <span>Stato</span>
          <strong>{patient.status}</strong>
        </div>
        <div>
          <span>Prossima visita</span>
          <strong>{patient.nextVisit}</strong>
        </div>
        <div>
          <span>Consensi</span>
          <strong className="with-icon">
            <ShieldCheck size={15} />
            {patient.consent}
          </strong>
        </div>
      </div>
    </section>
  );
}

function PatientList() {
  return (
    <section className="side-panel">
      <div className="panel-header compact">
        <div>
          <h2>Pazienti</h2>
          <p>Lista rapida</p>
        </div>
        <IconButton title="Nuovo paziente">
          <Plus size={17} />
        </IconButton>
      </div>
      <div className="patient-search">
        <Search size={15} />
        <span>Cerca paziente</span>
      </div>
      <div className="patient-list">
        {patients.map((row) => (
          <button type="button" key={row.name} className={row.name === patient.name ? "active" : ""}>
            <span>
              <strong>{row.name}</strong>
              <small>{row.status}</small>
            </span>
            <i className={toneClass(row.risk)}>{row.risk}</i>
          </button>
        ))}
      </div>
    </section>
  );
}

function MetricGrid() {
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <div className="metric" key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <i className={metric.tone === "ok" ? "positive" : "warning"}>{metric.delta}</i>
        </div>
      ))}
    </div>
  );
}

function LoopPanel() {
  return (
    <section className="card loop-card">
      <div className="panel-header">
        <div>
          <h2>Loop clinico</h2>
          <p>Motivo, valutazione, piano, azione, monitoraggio</p>
        </div>
        <Stethoscope size={19} />
      </div>
      <div className="loop-list">
        {loopSteps.map((step, index) => (
          <article key={step.label} className="loop-step">
            <div className="loop-index">{index + 1}</div>
            <div>
              <header>
                <strong>{step.label}</strong>
                <span>{step.state}</span>
              </header>
              <p>{step.detail}</p>
              <small>{step.updated}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MapToolbar({
  view,
  setView,
  timeIndex,
  setTimeIndex,
  activeFilters,
  toggleFilter,
  activeDate,
}) {
  return (
    <div className="map-toolbar">
      <div className="segmented" aria-label="Vista mappa">
        <button type="button" className={view === "front" ? "active" : ""} onClick={() => setView("front")}>
          anteriore
        </button>
        <button type="button" className={view === "back" ? "active" : ""} onClick={() => setView("back")}>
          posteriore
        </button>
      </div>
      <div className="filter-row">
        <span>
          <Filter size={14} />
          filtri
        </span>
        {findingFilters.map((filter) => (
          <button
            type="button"
            key={filter.id}
            className={activeFilters.has(filter.id) ? "active" : ""}
            onClick={() => toggleFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="time-control">
        <div>
          <span>Timeline</span>
          <strong>{timeline[timeIndex].label}</strong>
        </div>
        <input
          type="range"
          min="0"
          max={timeline.length - 1}
          value={timeIndex}
          aria-label="Timeline clinica"
          onChange={(event) => setTimeIndex(Number(event.target.value))}
        />
        <small>{activeDate}</small>
      </div>
    </div>
  );
}

function AreaDetails({ area, selectedFindings, severity }) {
  const hasFindings = selectedFindings.length > 0;
  const severityLabel = severity > 0.72 ? "critico" : severity > 0.4 ? "moderato" : severity > 0 ? "lieve" : "nessun rilievo";

  return (
    <aside className="area-details">
      <div className="area-title">
        <div>
          <span>{area.region}</span>
          <h3>{area.label}</h3>
        </div>
        <i className={toneClass(severityLabel)}>{severityLabel}</i>
      </div>
      {hasFindings ? (
        <div className="finding-list">
          {selectedFindings.map((finding) => (
            <article key={finding.id}>
              <header>
                <strong>{finding.label}</strong>
                <span>{finding.date}</span>
              </header>
              <p>{finding.note}</p>
              <div className="finding-meta">
                <span>{finding.type}</span>
                <span>{finding.taxonomy}</span>
                <span>{finding.source}</span>
              </div>
              <div className="measure-grid">
                {finding.measures.map((measure) => (
                  <div key={measure.label}>
                    <span>{measure.label}</span>
                    <strong>{measure.value}</strong>
                    <small>{measure.trend}</small>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CheckCircle2 size={18} />
          <span>Nessun rilievo filtrato su questa area.</span>
        </div>
      )}
    </aside>
  );
}

function MapCard({
  view,
  setView,
  selectedAreaId,
  setSelectedAreaId,
  timeIndex,
  setTimeIndex,
  activeFilters,
  toggleFilter,
}) {
  const activeDate = timeline[timeIndex].date;
  const area = getSelectedArea(selectedAreaId);
  const selectedFindings = getAreaFindings(selectedAreaId, activeDate, activeFilters);
  const severity = getAreaSeverity(selectedAreaId, activeDate, activeFilters);

  return (
    <section className="card map-card">
      <div className="panel-header map-heading">
        <div>
          <h2>Mappa corporea</h2>
          <p>
            {bodyAreaCount} aree anatomiche, {bodyRegionCount} regioni topografiche
          </p>
        </div>
        <div className="map-count">
          <Activity size={17} />
          drill-down attivo
        </div>
      </div>
      <MapToolbar
        view={view}
        setView={setView}
        timeIndex={timeIndex}
        setTimeIndex={setTimeIndex}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        activeDate={activeDate}
      />
      <div className="map-layout">
        <BodyMap
          view={view}
          selectedAreaId={selectedAreaId}
          onSelect={setSelectedAreaId}
          activeDate={activeDate}
          activeFilters={activeFilters}
        />
        <AreaDetails area={area} selectedFindings={selectedFindings} severity={severity} />
      </div>
    </section>
  );
}

function AssessmentPanel() {
  return (
    <section className="card">
      <div className="panel-header">
        <div>
          <h2>Assessment</h2>
          <p>Misure che alimentano la mappa</p>
        </div>
        <ClipboardList size={18} />
      </div>
      <div className="table-list">
        {assessmentRows.map((row) => (
          <div key={row.test}>
            <span>
              <strong>{row.test}</strong>
              <small>{row.side}</small>
            </span>
            <b>{row.value}</b>
            <i className={toneClass(row.flag)}>{row.flag}</i>
            <em>{row.push}</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlanPanel() {
  return (
    <section className="card">
      <div className="panel-header">
        <div>
          <h2>Piano attività</h2>
          <p>Calendario paziente</p>
        </div>
        <CalendarDays size={18} />
      </div>
      <div className="timeline-list">
        {planItems.map((item) => (
          <article key={`${item.when}-${item.title}`}>
            <time>{item.when}</time>
            <div>
              <span>{item.type}</span>
              <strong>{item.title}</strong>
              <small>{item.status}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromChart() {
  const pointsPain = promTrend
    .map((row, index) => `${38 + index * 73},${172 - row.pain * 1.35}`)
    .join(" ");
  const pointsFunction = promTrend
    .map((row, index) => `${38 + index * 73},${172 - row.function * 1.35}`)
    .join(" ");

  return (
    <section className="card chart-card">
      <div className="panel-header">
        <div>
          <h2>Monitoraggio PROMs</h2>
          <p>Dolore e funzione nel tempo</p>
        </div>
        <LineChart size={18} />
      </div>
      <svg viewBox="0 0 360 190" className="prom-chart" aria-label="Trend PROM">
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="28" x2="336" y1={32 + line * 40} y2={32 + line * 40} />
        ))}
        <polyline points={pointsPain} className="line pain" />
        <polyline points={pointsFunction} className="line function" />
        {promTrend.map((row, index) => (
          <g key={row.label}>
            <circle cx={38 + index * 73} cy={172 - row.pain * 1.35} r="4" className="dot pain" />
            <circle cx={38 + index * 73} cy={172 - row.function * 1.35} r="4" className="dot function" />
            <text x={38 + index * 73} y="184">
              {row.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="chart-legend">
        <span>
          <i className="pain" />
          dolore
        </span>
        <span>
          <i className="function" />
          funzione
        </span>
      </div>
    </section>
  );
}

function LibraryPanel() {
  return (
    <section className="card library-card">
      <div className="panel-header">
        <div>
          <h2>MyLab</h2>
          <p>Protocolli ed esercizi</p>
        </div>
        <FlaskConical size={18} />
      </div>
      <div className="split-list">
        <div>
          <h3>Protocolli</h3>
          {protocolRows.map((row) => (
            <article key={row.name}>
              <strong>{row.name}</strong>
              <span>
                {row.days} - {row.items}
              </span>
              <i>{row.state}</i>
            </article>
          ))}
        </div>
        <div>
          <h3>Esercizi</h3>
          {exerciseRows.map((row) => (
            <article key={row.name}>
              <strong>{row.name}</strong>
              <span>{row.rx}</span>
              <div className="mini-tags">
                {row.tags.map((tag) => (
                  <em key={tag}>{tag}</em>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiPanel() {
  return (
    <section className="card ai-card">
      <div className="panel-header">
        <div>
          <h2>Revisione clinica assistita</h2>
          <p>Bozze modificabili prima del salvataggio</p>
        </div>
        <Brain size={18} />
      </div>
      <div className="ai-list">
        {aiCards.map((card) => (
          <article key={card.title}>
            <header>
              <strong>{card.title}</strong>
              <span>{card.state}</span>
            </header>
            <p>{card.body}</p>
            <button type="button">
              rivedi
              <ChevronRight size={15} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function NetworkPanel() {
  return (
    <section className="card network-card">
      <div className="panel-header">
        <div>
          <h2>Network e consensi</h2>
          <p>Accessi granulari</p>
        </div>
        <Users size={18} />
      </div>
      <div className="network-list">
        {networkRows.map((row) => (
          <div key={row.person}>
            <span>
              <strong>{row.person}</strong>
              <small>{row.access}</small>
            </span>
            <i>{row.state}</i>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ClinicalPlatformApp() {
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("back");
  const [selectedAreaId, setSelectedAreaId] = useState("back-center-lumbar_spine");
  const [timeIndex, setTimeIndex] = useState(timeline.length - 1);
  const [activeFilters, setActiveFilters] = useState(() => new Set(allFilterIds()));

  const activeFilterCount = activeFilters.size;
  const todayFindings = useMemo(() => {
    const activeDate = timeline[timeIndex].date;
    return findingsForCurrentFilters(activeDate, activeFilters);
  }, [timeIndex, activeFilters]);

  function toggleFilter(id) {
    setActiveFilters((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next.size ? next : new Set([id]);
    });
  }

  return (
    <div className="clinical-app" data-theme={theme}>
      <Sidebar />
      <main className="workspace">
        <header className="topbar">
          <div>
            <span className="product-name">ClinicaOS</span>
            <strong>Dashboard paziente</strong>
          </div>
          <div className="top-actions">
            <div className="global-search">
              <Search size={15} />
              <span>Cerca in cartella</span>
            </div>
            <IconButton title="Notifiche">
              <Bell size={17} />
            </IconButton>
            <IconButton title="Tema" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </IconButton>
          </div>
        </header>

        <PatientStrip />

        <section className="content-grid">
          <div className="left-column">
            <PatientList />
            <section className="side-panel">
              <div className="panel-header compact">
                <div>
                  <h2>Alert</h2>
                  <p>{todayFindings.length} rilievi visibili</p>
                </div>
                <AlertTriangle size={18} />
              </div>
              <div className="alert-list">
                <div>
                  <strong>L4-L5</strong>
                  <span>rischio alto, rivalutare estensione</span>
                </div>
                <div>
                  <strong>Filtri attivi</strong>
                  <span>{activeFilterCount} categorie cliniche</span>
                </div>
              </div>
            </section>
          </div>

          <div className="main-column">
            <MetricGrid />
            <MapCard
              view={view}
              setView={setView}
              selectedAreaId={selectedAreaId}
              setSelectedAreaId={setSelectedAreaId}
              timeIndex={timeIndex}
              setTimeIndex={setTimeIndex}
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
            />
            <section className="lower-grid">
              <AssessmentPanel />
              <PlanPanel />
              <PromChart />
              <LibraryPanel />
              <NetworkPanel />
            </section>
          </div>

          <div className="right-column">
            <LoopPanel />
            <AiPanel />
            <section className="card patient-app-card">
              <div className="panel-header">
                <div>
                  <h2>App paziente</h2>
                  <p>PWA collegata alla cartella</p>
                </div>
                <Dumbbell size={18} />
              </div>
              <div className="app-checks">
                <span>
                  <CheckCircle2 size={15} />
                  piano esercizi inviato
                </span>
                <span>
                  <CheckCircle2 size={15} />
                  PROM ogni 10 giorni
                </span>
                <span>
                  <CheckCircle2 size={15} />
                  feedback RPE richiesto
                </span>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

function findingsForCurrentFilters(activeDate, activeFilters) {
  const current = Number(activeDate.replaceAll("-", ""));
  return findings.filter((finding) => {
    return activeFilters.has(finding.type) && Number(finding.date.replaceAll("-", "")) <= current;
  });
}
