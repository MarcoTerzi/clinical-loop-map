"use client";

import { bodyAreas, findingFilters, findings } from "@/app/data/clinicalData";

const severityStops = [
  { max: 0.01, className: "severity-none", label: "nessun rilievo" },
  { max: 0.4, className: "severity-low", label: "lieve" },
  { max: 0.72, className: "severity-mid", label: "moderato" },
  { max: 1, className: "severity-high", label: "critico" },
];

function normalizeDate(date) {
  return Number(String(date || "").replaceAll("-", ""));
}

function getSeverity(areaId, activeDate, activeFilters) {
  const current = normalizeDate(activeDate);
  return findings.reduce((max, finding) => {
    if (finding.areaId !== areaId) return max;
    if (!activeFilters.has(finding.type)) return max;
    if (normalizeDate(finding.date) > current) return max;

    const value = finding.historical ? finding.severity * 0.68 : finding.severity;
    return Math.max(max, value);
  }, 0);
}

function severityMeta(severity) {
  return severityStops.find((stop) => severity <= stop.max) || severityStops[0];
}

function Silhouette({ view }) {
  return (
    <g className="silhouette" aria-hidden="true">
      <ellipse cx="160" cy="61" rx="39" ry="48" />
      <rect x="137" y="104" width="46" height="43" rx="18" />
      <path d="M104 146 C86 175 83 231 90 294 C95 347 104 385 111 432 C119 485 124 531 119 583 C116 619 105 652 105 711 C105 781 95 828 93 885 L143 885 C147 823 151 772 151 712 C151 655 149 616 154 584 C157 562 162 562 166 584 C171 618 169 655 169 712 C169 772 173 823 177 885 L227 885 C225 828 215 781 215 711 C215 652 204 619 201 583 C196 531 201 485 209 432 C216 385 225 347 230 294 C237 231 234 175 216 146 C200 135 179 130 160 130 C141 130 120 135 104 146 Z" />
      <path d="M101 166 C74 183 60 220 54 278 L35 455 C32 484 39 514 57 539 L82 522 C73 501 70 476 74 451 L90 305 C94 262 105 225 123 203 Z" />
      <path d="M219 166 C246 183 260 220 266 278 L285 455 C288 484 281 514 263 539 L238 522 C247 501 250 476 246 451 L230 305 C226 262 215 225 197 203 Z" />
      {view === "back" && (
        <>
          <path className="silhouette-line" d="M160 101 L160 513" />
          <path className="silhouette-line" d="M105 182 C129 202 191 202 215 182" />
          <path className="silhouette-line" d="M112 472 C134 503 186 503 208 472" />
        </>
      )}
      {view === "front" && (
        <>
          <path className="silhouette-line" d="M132 169 C145 190 175 190 188 169" />
          <path className="silhouette-line" d="M121 410 C139 431 181 431 199 410" />
        </>
      )}
    </g>
  );
}

function Hotspot({ area, severity, selected, onSelect }) {
  const meta = severityMeta(severity);
  const shape = area.shape;
  const common = {
    className: `hotspot ${meta.className} ${selected ? "selected" : ""}`,
    role: "button",
    tabIndex: 0,
    onClick: () => onSelect(area.id),
    onKeyDown: (event) => {
      if (event.key === "Enter" || event.key === " ") onSelect(area.id);
    },
  };

  const title = `${area.label} - ${meta.label}`;

  if (shape.kind === "ellipse") {
    return (
      <ellipse
        {...common}
        cx={shape.x + shape.width / 2}
        cy={shape.y + shape.height / 2}
        rx={shape.width / 2}
        ry={shape.height / 2}
      >
        <title>{title}</title>
      </ellipse>
    );
  }

  return (
    <rect
      {...common}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      rx={shape.rx}
    >
      <title>{title}</title>
    </rect>
  );
}

export default function BodyMap({ view, selectedAreaId, onSelect, activeDate, activeFilters }) {
  const areas = bodyAreas.filter((area) => area.view === view);

  return (
    <div className="body-map-stage">
      <svg className="body-map-svg" viewBox="0 0 320 910" aria-label={`Mappa corporea ${view}`}>
        <Silhouette view={view} />
        <g>
          {areas.map((area) => {
            const severity = getSeverity(area.id, activeDate, activeFilters);
            return (
              <Hotspot
                key={area.id}
                area={area}
                severity={severity}
                selected={area.id === selectedAreaId}
                onSelect={onSelect}
              />
            );
          })}
        </g>
      </svg>

      <div className="map-legend">
        {severityStops.map((stop) => (
          <span key={stop.className}>
            <i className={stop.className} />
            {stop.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function getSelectedArea(areaId) {
  return bodyAreas.find((area) => area.id === areaId) || bodyAreas[0];
}

export function getAreaFindings(areaId, activeDate, activeFilters) {
  const current = normalizeDate(activeDate);
  return findings.filter((finding) => {
    return (
      finding.areaId === areaId &&
      activeFilters.has(finding.type) &&
      normalizeDate(finding.date) <= current
    );
  });
}

export function getAreaSeverity(areaId, activeDate, activeFilters) {
  return getSeverity(areaId, activeDate, activeFilters);
}

export function allFilterIds() {
  return findingFilters.map((filter) => filter.id);
}
