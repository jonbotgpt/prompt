import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import {
  player, teams, yearlyRecord, careerRecord, matches,
  ratingHistory, monthlyActivity, projections
} from "./data";

const colors = {
  green: "#10b981",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  cyan: "#06b6d4",
  slate: "#64748b",
  card: "#1e293b",
  cardBorder: "#334155",
};

function StatCard({ label, value, sub, color = colors.blue }) {
  return (
    <div style={{
      background: colors.card, borderRadius: 16, padding: "24px",
      border: `1px solid ${colors.cardBorder}`, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <div style={{ fontSize: 13, color: colors.slate, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#f8fafc", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: colors.slate, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: colors.slate, marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

function MatchRow({ match, idx }) {
  const isWin = match.result === "W";
  const d = new Date(match.date + "T00:00:00");
  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "80px 32px 1fr 120px 100px",
      alignItems: "center", padding: "12px 16px", gap: 12,
      background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
      borderBottom: `1px solid ${colors.cardBorder}`,
      transition: "background 0.15s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)"}
    >
      <span style={{ fontSize: 13, color: colors.slate }}>{dateStr}</span>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 28, height: 28, borderRadius: 6, fontSize: 12, fontWeight: 700,
        background: isWin ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        color: isWin ? colors.green : colors.red,
      }}>{match.result}</span>
      <div>
        <div style={{ fontSize: 13, color: "#94a3b8" }}>{match.event}</div>
      </div>
      <span style={{
        fontSize: 13, color: "#cbd5e1", fontFamily: "'SF Mono', 'Fira Code', monospace",
        padding: "2px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 4, width: "fit-content",
      }}>{match.score}</span>
      <div style={{ textAlign: "right" }}>
        <span style={{
          fontSize: 12, padding: "2px 8px", borderRadius: 4,
          background: match.type === "Singles" ? "rgba(59,130,246,0.15)" : "rgba(139,92,246,0.15)",
          color: match.type === "Singles" ? colors.blue : colors.purple,
        }}>{match.type}</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e293b", border: "1px solid #475569", borderRadius: 8,
      padding: "10px 14px", fontSize: 13,
    }}>
      <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" && p.value % 1 !== 0 ? p.value.toFixed(4) : p.value}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, max, color, label }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: "#cbd5e1" }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{value}/{max} ({pct.toFixed(1)}%)</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: 3, transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

function RatingMeter({ rating, min, max }) {
  const range = max - min;
  const pct = ((rating - min) / range) * 100;
  return (
    <div style={{ position: "relative", height: 12, background: "rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${colors.red}, ${colors.amber}, ${colors.green})`,
        borderRadius: 6,
      }} />
      <div style={{
        position: "absolute", left: `${pct}%`, top: -2, width: 4, height: 16,
        background: "#fff", borderRadius: 2, transform: "translateX(-50%)",
        boxShadow: "0 0 6px rgba(255,255,255,0.5)",
      }} />
    </div>
  );
}

export default function App() {
  const [matchFilter, setMatchFilter] = useState("All");

  const filteredMatches = matches.filter(m =>
    matchFilter === "All" ? true : m.type === matchFilter
  );

  const yr2026 = yearlyRecord.find(y => y.year === 2026);
  const pieData = [
    { name: "Matches Won", value: careerRecord.wins, color: colors.green },
    { name: "Matches Lost", value: careerRecord.losses, color: colors.red },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.card} 0%, #0f2035 100%)`,
        borderRadius: 20, padding: "32px 36px", marginBottom: 28,
        border: `1px solid ${colors.cardBorder}`, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(59,130,246,0.06)",
        }} />
        <div style={{
          position: "absolute", bottom: -40, right: 60, width: 120, height: 120,
          borderRadius: "50%", background: "rgba(16,185,129,0.04)",
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: colors.blue, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Player Dashboard
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f8fafc", margin: 0, lineHeight: 1.2 }}>
              {player.name}
            </h1>
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>{player.location}</span>
              <span style={{ fontSize: 14, color: "#475569" }}>|</span>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>{player.section} / {player.area}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{
              background: "rgba(59,130,246,0.12)", borderRadius: 12, padding: "16px 24px",
              textAlign: "center", border: "1px solid rgba(59,130,246,0.2)",
            }}>
              <div style={{ fontSize: 11, color: colors.blue, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>NTRP</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc" }}>{player.ntrp}</div>
              <div style={{ fontSize: 10, color: colors.slate }}>{player.ntrpDate}</div>
            </div>
            <div style={{
              background: "rgba(16,185,129,0.12)", borderRadius: 12, padding: "16px 24px",
              textAlign: "center", border: "1px solid rgba(16,185,129,0.2)",
            }}>
              <div style={{ fontSize: 11, color: colors.green, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Dynamic</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc" }}>{player.dynamicRating.toFixed(4)}</div>
              <div style={{ fontSize: 10, color: colors.slate }}>{player.dynamicRatingDate}</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20, maxWidth: 300 }}>
          <div style={{ fontSize: 11, color: colors.slate, marginBottom: 6 }}>4.0 Rating Range (3.5001 - 4.0000)</div>
          <RatingMeter rating={player.dynamicRating} min={3.5001} max={4.0} />
        </div>
        <a href={player.profileUrl} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: colors.blue, textDecoration: "none", marginTop: 16, display: "inline-block" }}>
          View on TennisRecord.com &#x2192;
        </a>
      </div>

      {/* Career Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Career Record" value={`${careerRecord.wins}-${careerRecord.losses}`} sub={`${careerRecord.winPct}% win rate`} color={colors.green} />
        <StatCard label="2026 Record" value={`${yr2026.wins}-${yr2026.losses}`} sub={`${yr2026.winPct}% in ${yr2026.matches} matches`} color={colors.blue} />
        <StatCard label="Career Sets" value={`${careerRecord.setsWon}-${careerRecord.setsLost}`} sub={`${careerRecord.setWinPct}% set win rate`} color={colors.purple} />
        <StatCard label="Career Games" value={`${careerRecord.gamesWon}-${careerRecord.gamesLost}`} sub={`${careerRecord.gameWinPct}% game win rate`} color={colors.cyan} />
        <StatCard label="Total Matches" value={careerRecord.matches} sub="Since 2024" color={colors.amber} />
      </div>

      {/* Year-by-Year Table */}
      <div style={{
        background: colors.card, borderRadius: 16, padding: 24, marginBottom: 28,
        border: `1px solid ${colors.cardBorder}`,
      }}>
        <SectionHeader title="Year-by-Year Record" subtitle="Complete match, set, and game statistics" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.cardBorder}` }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: colors.slate, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>Year</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: colors.slate, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>Matches</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: colors.green, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>W</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: colors.red, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>L</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: colors.slate, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>W%</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: colors.slate, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>Sets W-L</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: colors.slate, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>Set%</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: colors.slate, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>Games W-L</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: colors.slate, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>Game%</th>
              </tr>
            </thead>
            <tbody>
              {yearlyRecord.map((yr, i) => (
                <tr key={yr.year} style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <td style={{ padding: "12px", fontWeight: 700, color: colors.blue }}>{yr.year}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#cbd5e1" }}>{yr.matches}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: colors.green, fontWeight: 600 }}>{yr.wins}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: colors.red, fontWeight: 600 }}>{yr.losses}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <span style={{
                      padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: yr.winPct >= 75 ? "rgba(16,185,129,0.15)" : yr.winPct >= 60 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                      color: yr.winPct >= 75 ? colors.green : yr.winPct >= 60 ? colors.amber : colors.red,
                    }}>{yr.winPct}%</span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#cbd5e1" }}>{yr.setsWon}-{yr.setsLost}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#94a3b8" }}>{yr.setWinPct}%</td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#cbd5e1" }}>{yr.gamesWon}-{yr.gamesLost}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#94a3b8" }}>{yr.gameWinPct}%</td>
                </tr>
              ))}
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                <td style={{ padding: "12px", fontWeight: 700, color: "#f1f5f9" }}>Total</td>
                <td style={{ padding: "12px", textAlign: "center", color: "#f1f5f9", fontWeight: 700 }}>{careerRecord.matches}</td>
                <td style={{ padding: "12px", textAlign: "center", color: colors.green, fontWeight: 700 }}>{careerRecord.wins}</td>
                <td style={{ padding: "12px", textAlign: "center", color: colors.red, fontWeight: 700 }}>{careerRecord.losses}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "rgba(16,185,129,0.15)", color: colors.green }}>
                    {careerRecord.winPct}%
                  </span>
                </td>
                <td style={{ padding: "12px", textAlign: "center", color: "#f1f5f9", fontWeight: 700 }}>{careerRecord.setsWon}-{careerRecord.setsLost}</td>
                <td style={{ padding: "12px", textAlign: "center", color: "#cbd5e1", fontWeight: 600 }}>{careerRecord.setWinPct}%</td>
                <td style={{ padding: "12px", textAlign: "center", color: "#f1f5f9", fontWeight: 700 }}>{careerRecord.gamesWon}-{careerRecord.gamesLost}</td>
                <td style={{ padding: "12px", textAlign: "center", color: "#cbd5e1", fontWeight: 600 }}>{careerRecord.gameWinPct}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Dynamic Rating Movement */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Dynamic Rating Movement" subtitle="Estimated NTRP dynamic rating over time" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ratingHistory}>
              <defs>
                <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.green} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis domain={[3.5, 4.0]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rating" stroke={colors.green} strokeWidth={2.5}
                fill="url(#ratingGrad)" name="Dynamic Rating" dot={{ fill: colors.green, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Activity */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Match Activity" subtitle="Wins and losses by month" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyActivity} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="wins" stackId="a" fill={colors.green} name="Wins" radius={[0, 0, 0, 0]} />
              <Bar dataKey="losses" stackId="a" fill={colors.red} name="Losses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Year-over-Year Comparison + Win Rate Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Win Rate by Year */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Win Rate by Year" subtitle="Match, set, and game win percentages" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearlyRecord} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="winPct" fill={colors.green} name="Match W%" radius={[4, 4, 0, 0]} />
              <Bar dataKey="setWinPct" fill={colors.blue} name="Set W%" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gameWinPct" fill={colors.purple} name="Game W%" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Career Breakdown Pie */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Career Overview" subtitle="Win/loss distribution and deep stats" />
          <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 140, height: 140 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                    paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "#cbd5e1" }}>{d.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginLeft: "auto" }}>{d.value}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${colors.cardBorder}`, marginTop: 8, paddingTop: 8 }}>
                <div style={{ fontSize: 12, color: colors.slate }}>0 Defaults in {careerRecord.matches} matches</div>
              </div>
            </div>
          </div>
          <ProgressBar label="Sets Won" value={careerRecord.setsWon} max={careerRecord.setsWon + careerRecord.setsLost} color={colors.blue} />
          <ProgressBar label="Games Won" value={careerRecord.gamesWon} max={careerRecord.gamesWon + careerRecord.gamesLost} color={colors.purple} />
        </div>
      </div>

      {/* Teams + Projections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Active Teams */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Recent Teams" subtitle="Current and recent team affiliations" />
          {teams.map((team, i) => (
            <div key={i} style={{
              padding: "14px 0",
              borderBottom: i < teams.length - 1 ? `1px solid ${colors.cardBorder}` : "none",
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.blue, marginBottom: 4 }}>{team.name}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 4,
                  background: "rgba(139,92,246,0.12)", color: colors.purple,
                }}>{team.type}</span>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 4,
                  background: "rgba(6,182,212,0.12)", color: colors.cyan,
                }}>{team.rating} level</span>
                <span style={{ fontSize: 12, color: colors.slate }}>Started {team.matchStart}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Year-End Projections */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Year-End Projections" subtitle="Based on current 2026 pace" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: colors.slate, textTransform: "uppercase", marginBottom: 4 }}>Proj. Matches</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc" }}>{projections.yearEnd.projectedMatches}</div>
              <div style={{ fontSize: 12, color: colors.slate }}>~{projections.currentPace.matchesPerMonth.toFixed(1)}/month</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: colors.slate, textTransform: "uppercase", marginBottom: 4 }}>Proj. Record</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: colors.green }}>
                {projections.yearEnd.projectedWins}-{projections.yearEnd.projectedLosses}
              </div>
              <div style={{ fontSize: 12, color: colors.slate }}>{projections.yearEnd.projectedWinPct}% win rate</div>
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 12 }}>Milestones</div>
          {projections.milestones.map((m, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: i < projections.milestones.length - 1 ? `1px solid ${colors.cardBorder}` : "none",
            }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{m.target}</span>
                <span style={{ fontSize: 12, color: colors.slate, marginLeft: 8 }}>{m.projectedDate}</span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                background: m.confidence === "High" ? "rgba(16,185,129,0.15)" : m.confidence === "Medium" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                color: m.confidence === "High" ? colors.green : m.confidence === "Medium" ? colors.amber : colors.red,
              }}>{m.confidence}</span>
            </div>
          ))}
          <div style={{
            marginTop: 16, padding: 12, borderRadius: 8,
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
          }}>
            <div style={{ fontSize: 12, color: colors.blue, fontWeight: 600 }}>Insight</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              2024 was dominant (88.9% W). 2026 started slower (66.7%) with tougher competition at 4.5 level doubles.
              Summer schedule ramp-up could push the win rate back above 70%.
            </div>
          </div>
        </div>
      </div>

      {/* Match History */}
      <div style={{
        background: colors.card, borderRadius: 16, overflow: "hidden",
        border: `1px solid ${colors.cardBorder}`, marginBottom: 28,
      }}>
        <div style={{ padding: "24px 24px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <SectionHeader title="Match Log" subtitle={`${filteredMatches.length} matches`} />
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "Singles", "Doubles"].map(f => (
                <button key={f} onClick={() => setMatchFilter(f)} style={{
                  padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 500, transition: "all 0.15s",
                  background: matchFilter === f ? colors.blue : "rgba(255,255,255,0.06)",
                  color: matchFilter === f ? "#fff" : "#94a3b8",
                }}>{f}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: "0 8px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "80px 32px 1fr 120px 100px",
            padding: "8px 16px", gap: 12, fontSize: 11, color: colors.slate,
            textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600,
          }}>
            <span>Date</span><span></span><span>Event</span><span>Score</span><span style={{ textAlign: "right" }}>Type</span>
          </div>
          {filteredMatches.map((m, i) => <MatchRow key={i} match={m} idx={i} />)}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px 0 40px", color: colors.slate, fontSize: 12 }}>
        Data sourced from{" "}
        <a href={player.profileUrl} target="_blank" rel="noopener noreferrer"
          style={{ color: colors.blue, textDecoration: "none" }}>
          TennisRecord.com
        </a>
        {" "} &#x2022; Last updated Jun 2026
      </div>
    </div>
  );
}
