import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Cell, PieChart, Pie
} from "recharts";
import {
  player, seasonRecord, matches, ratingHistory,
  monthlyActivity, projections, performanceBreakdown
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
  bg: "#0f172a",
};

function StatCard({ label, value, sub, color = colors.blue, icon }) {
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
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}{label}
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
  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "60px 32px 1fr 1fr 120px",
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
        <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{match.opponent}</div>
        <div style={{ fontSize: 12, color: colors.slate }}>{match.event}</div>
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
          {p.name}: {typeof p.value === "number" && p.value % 1 !== 0 ? p.value.toFixed(2) : p.value}
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
        <span style={{ color, fontWeight: 600 }}>{value}/{max}</span>
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

export default function App() {
  const [matchFilter, setMatchFilter] = useState("All");
  const [showAllMatches, setShowAllMatches] = useState(false);

  const filteredMatches = matches.filter(m =>
    matchFilter === "All" ? true : m.type === matchFilter
  );
  const displayedMatches = showAllMatches ? filteredMatches : filteredMatches.slice(0, 10);

  const winPct = ((seasonRecord.total.wins / (seasonRecord.total.wins + seasonRecord.total.losses)) * 100).toFixed(1);
  const singlesWinPct = ((seasonRecord.singles.wins / (seasonRecord.singles.wins + seasonRecord.singles.losses)) * 100).toFixed(1);
  const doublesWinPct = ((seasonRecord.doubles.wins / (seasonRecord.doubles.wins + seasonRecord.doubles.losses)) * 100).toFixed(1);

  const pieData = [
    { name: "2-Set Wins", value: performanceBreakdown.byMatchType.twoSetWins, color: colors.green },
    { name: "3-Set Wins", value: performanceBreakdown.byMatchType.threeSetWins, color: colors.cyan },
    { name: "2-Set Losses", value: performanceBreakdown.byMatchType.twoSetLosses, color: colors.amber },
    { name: "3-Set Losses", value: performanceBreakdown.byMatchType.threeSetLosses, color: colors.red },
  ];

  const ratingGrowth = (ratingHistory[ratingHistory.length - 1].rating - ratingHistory[0].rating).toFixed(2);

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
              <span style={{ fontSize: 14, color: "#94a3b8" }}>{player.section} Section</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{
              background: "rgba(59,130,246,0.12)", borderRadius: 12, padding: "16px 24px",
              textAlign: "center", border: "1px solid rgba(59,130,246,0.2)",
            }}>
              <div style={{ fontSize: 11, color: colors.blue, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>NTRP</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc" }}>{player.rating}</div>
            </div>
            <div style={{
              background: "rgba(16,185,129,0.12)", borderRadius: 12, padding: "16px 24px",
              textAlign: "center", border: "1px solid rgba(16,185,129,0.2)",
            }}>
              <div style={{ fontSize: 11, color: colors.green, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>UTR</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc" }}>{player.utr}</div>
            </div>
          </div>
        </div>
        <a href={player.profileUrl} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: colors.blue, textDecoration: "none", marginTop: 16, display: "inline-block" }}>
          View on TennisRecord.com &#x2192;
        </a>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Season Record" value={`${seasonRecord.total.wins}-${seasonRecord.total.losses}`} sub={`${winPct}% win rate`} color={colors.green} />
        <StatCard label="Singles" value={`${seasonRecord.singles.wins}-${seasonRecord.singles.losses}`} sub={`${singlesWinPct}% win rate`} color={colors.blue} />
        <StatCard label="Doubles" value={`${seasonRecord.doubles.wins}-${seasonRecord.doubles.losses}`} sub={`${doublesWinPct}% win rate`} color={colors.purple} />
        <StatCard label="Current Streak" value={`${seasonRecord.currentStreak.count}${seasonRecord.currentStreak.type}`}
          sub={seasonRecord.currentStreak.type === "W" ? "Consecutive wins" : "Consecutive losses"}
          color={seasonRecord.currentStreak.type === "W" ? colors.green : colors.red} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Rating Movement */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Rating Movement" subtitle={`+${ratingGrowth} UTR since Nov '25`} />
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
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rating" stroke={colors.green} strokeWidth={2.5}
                fill="url(#ratingGrad)" name="UTR Rating" dot={{ fill: colors.green, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Activity */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Monthly Activity" subtitle="Matches played per month" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyActivity} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="wins" stackId="a" fill={colors.green} name="Wins" radius={[0, 0, 0, 0]} />
              <Bar dataKey="losses" stackId="a" fill={colors.red} name="Losses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Year-End Projections + Performance Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Projections */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Year-End Projections" subtitle="Based on current pace and trajectory" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: colors.slate, textTransform: "uppercase", marginBottom: 4 }}>Projected Rating</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: colors.green }}>{projections.yearEnd.projectedRating}</div>
              <div style={{ fontSize: 12, color: colors.slate }}>{projections.yearEnd.ratingTrend}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: colors.slate, textTransform: "uppercase", marginBottom: 4 }}>Projected Record</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc" }}>
                {projections.yearEnd.projectedWins}-{projections.yearEnd.projectedLosses}
              </div>
              <div style={{ fontSize: 12, color: colors.slate }}>{(projections.yearEnd.projectedWinRate * 100).toFixed(1)}% win rate</div>
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
                background: m.confidence === "High" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                color: m.confidence === "High" ? colors.green : colors.amber,
              }}>{m.confidence}</span>
            </div>
          ))}
        </div>

        {/* Performance Breakdown */}
        <div style={{
          background: colors.card, borderRadius: 16, padding: 24,
          border: `1px solid ${colors.cardBorder}`,
        }}>
          <SectionHeader title="Performance Breakdown" subtitle="Match format and set analysis" />
          <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                    paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#cbd5e1" }}>{d.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginLeft: "auto" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: 16 }}>
            <ProgressBar label="Sets Won" value={performanceBreakdown.bySet.setsWon}
              max={performanceBreakdown.bySet.setsWon + performanceBreakdown.bySet.setsLost} color={colors.green} />
            <ProgressBar label="Tiebreak Record" value={performanceBreakdown.tiebreakRecord.wins}
              max={performanceBreakdown.tiebreakRecord.wins + performanceBreakdown.tiebreakRecord.losses} color={colors.amber} />
          </div>
          <div style={{
            marginTop: 12, padding: 12, borderRadius: 8,
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)",
          }}>
            <div style={{ fontSize: 12, color: colors.amber, fontWeight: 600 }}>Tiebreak Insight</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              3-4 in tiebreaks — converting more of these could swing 2+ matches per season.
            </div>
          </div>
        </div>
      </div>

      {/* Projection Chart */}
      <div style={{
        background: colors.card, borderRadius: 16, padding: 24, marginBottom: 28,
        border: `1px solid ${colors.cardBorder}`,
      }}>
        <SectionHeader title="Rating Trajectory" subtitle="Actual performance and projected year-end path" />
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={[
            ...ratingHistory,
            { month: "Jul '26", rating: 6.95, projected: 6.95 },
            { month: "Aug '26", rating: null, projected: 7.00 },
            { month: "Sep '26", rating: null, projected: 7.05 },
            { month: "Oct '26", rating: null, projected: 7.08 },
            { month: "Nov '26", rating: null, projected: 7.12 },
            { month: "Dec '26", rating: null, projected: 7.15 },
          ]}>
            <defs>
              <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.blue} stopOpacity={0.2} />
                <stop offset="100%" stopColor={colors.blue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.green} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colors.green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis domain={[6.2, 7.3]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="rating" stroke={colors.green} strokeWidth={2.5}
              fill="url(#actualGrad)" name="Actual" dot={{ fill: colors.green, r: 3 }} connectNulls={false} />
            <Area type="monotone" dataKey="projected" stroke={colors.blue} strokeWidth={2}
              strokeDasharray="6 4" fill="url(#projGrad)" name="Projected"
              dot={{ fill: colors.blue, r: 3, strokeDasharray: "" }} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Match History */}
      <div style={{
        background: colors.card, borderRadius: 16, overflow: "hidden",
        border: `1px solid ${colors.cardBorder}`, marginBottom: 28,
      }}>
        <div style={{ padding: "24px 24px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <SectionHeader title="Match History" subtitle={`${filteredMatches.length} matches`} />
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
            display: "grid", gridTemplateColumns: "60px 32px 1fr 1fr 120px",
            padding: "8px 16px", gap: 12, fontSize: 11, color: colors.slate,
            textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600,
          }}>
            <span>Date</span><span></span><span>Opponent</span><span>Score</span><span style={{ textAlign: "right" }}>Type</span>
          </div>
          {displayedMatches.map((m, i) => <MatchRow key={i} match={m} idx={i} />)}
        </div>
        {filteredMatches.length > 10 && (
          <div style={{ padding: 16, textAlign: "center" }}>
            <button onClick={() => setShowAllMatches(!showAllMatches)} style={{
              padding: "8px 24px", borderRadius: 8, border: `1px solid ${colors.cardBorder}`,
              background: "transparent", color: colors.blue, cursor: "pointer",
              fontSize: 13, fontWeight: 500,
            }}>
              {showAllMatches ? "Show Less" : `Show All ${filteredMatches.length} Matches`}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px 0 40px", color: colors.slate, fontSize: 12 }}>
        Data sourced from{" "}
        <a href={player.profileUrl} target="_blank" rel="noopener noreferrer"
          style={{ color: colors.blue, textDecoration: "none" }}>
          TennisRecord.com
        </a>
        {" "} &#x2022; Dashboard updated Jun 2026
      </div>
    </div>
  );
}
