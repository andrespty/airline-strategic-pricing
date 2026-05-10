import { Link } from 'react-router-dom'
import './CompleteInfo.css'

export default function CompleteInfo() {
  return (
    <div className="ci-page">
      <div className="ci-header">
        <div className="ci-breadcrumb">
          <Link to="/" className="ci-back">← Home</Link>
          <span className="ci-sep">/</span>
          <span>Complete information</span>
        </div>
        <div className="ci-badge">Coming soon</div>
      </div>

      <div className="ci-body">
        <div className="ci-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="1" y="1" width="46" height="46" rx="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <rect x="10" y="22" width="28" height="16" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            <path d="M18 22V16a6 6 0 0112 0v6" stroke="rgba(200,240,96,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="24" cy="30" r="2" fill="rgba(200,240,96,0.4)"/>
          </svg>
        </div>

        <h1 className="ci-title">Complete information equilibrium</h1>
        <p className="ci-desc">
          In the complete information setting, both firms observe each other's costs.
          There is no uncertainty — the equilibrium reduces to a standard Nash Equilibrium
          and can be computed analytically from the best-response functions.
        </p>

        <div className="ci-preview-grid">
          <div className="ci-preview-card">
            <div className="ci-preview-label">What this page will show</div>
            <ul className="ci-preview-list">
              <li>Set costs for both firms directly via sliders</li>
              <li>Analytical Nash Equilibrium prices computed in real time</li>
              <li>Equilibrium profits and market shares</li>
              <li>Side-by-side comparison with the Bayesian (incomplete info) case</li>
              <li>How equilibrium prices shift as cost asymmetry increases</li>
            </ul>
          </div>

          <div className="ci-preview-card">
            <div className="ci-preview-label">Key result to illustrate</div>
            <p className="ci-preview-text">
              With complete information, each firm knows exactly how the opponent will respond.
              Prices are generally <em>lower</em> than in the Bayesian case — private information
              allows firms to earn information rents, pushing equilibrium prices above the
              complete-information benchmark.
            </p>
          </div>
        </div>

        <div className="ci-coming-formula">
          <div className="ci-formula-label">Equilibrium condition (to be solved)</div>
          <div className="ci-formula">
            p<sub>i</sub>* = argmax<sub>p</sub> (p − c<sub>i</sub>) · q<sub>i</sub>(p, p<sub>j</sub>*)
          </div>
          <div className="ci-formula-sub">where both p₁* and p₂* solve simultaneously</div>
        </div>

        <Link to="/incomplete" className="ci-cta">
          Explore the incomplete information model instead →
        </Link>
      </div>
    </div>
  )
}
