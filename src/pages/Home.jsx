import { Link } from 'react-router-dom'
import './Home.css'

function GameDiagram() {
  return (
    <svg className="game-diagram" viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Firm 1 */}
      <rect x="20" y="60" width="140" height="80" rx="6" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <text x="90" y="92" textAnchor="middle" fontFamily="DM Sans" fontSize="12" fontWeight="500" fill="#f0ede6">Firm 1</text>
      <text x="90" y="112" textAnchor="middle" fontFamily="DM Mono" fontSize="11" fill="#8a8880">cost c₁ ~ U[80,250]</text>
      <text x="90" y="128" textAnchor="middle" fontFamily="DM Mono" fontSize="11" fill="rgba(200,240,96,0.7)">private</text>

      {/* Firm 2 */}
      <rect x="440" y="60" width="140" height="80" rx="6" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <text x="510" y="92" textAnchor="middle" fontFamily="DM Sans" fontSize="12" fontWeight="500" fill="#f0ede6">Firm 2</text>
      <text x="510" y="112" textAnchor="middle" fontFamily="DM Mono" fontSize="11" fill="#8a8880">cost c₂ ~ U[80,250]</text>
      <text x="510" y="128" textAnchor="middle" fontFamily="DM Mono" fontSize="11" fill="rgba(200,240,96,0.7)">private</text>

      {/* Market center */}
      <rect x="220" y="75" width="160" height="50" rx="6" fill="#1a1a1a" stroke="rgba(200,240,96,0.2)" strokeWidth="1"/>
      <text x="300" y="97" textAnchor="middle" fontFamily="DM Sans" fontSize="11" fill="#8a8880">Market demand</text>
      <text x="300" y="113" textAnchor="middle" fontFamily="DM Mono" fontSize="10" fill="#555350">q = α − β·c·Σpⱼ</text>

      {/* Arrows from firms to market */}
      <line x1="160" y1="100" x2="218" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <polygon points="218,96 226,100 218,104" fill="rgba(255,255,255,0.2)"/>
      <text x="188" y="93" textAnchor="middle" fontFamily="DM Mono" fontSize="10" fill="#555350">p₁</text>

      <line x1="440" y1="100" x2="382" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <polygon points="382,96 374,100 382,104" fill="rgba(255,255,255,0.2)"/>
      <text x="412" y="93" textAnchor="middle" fontFamily="DM Mono" fontSize="10" fill="#555350">p₂</text>

      {/* BNE label below */}
      <text x="300" y="168" textAnchor="middle" fontFamily="DM Sans" fontSize="11" fill="#555350">Each firm sets price to maximize expected profit</text>
      <text x="300" y="185" textAnchor="middle" fontFamily="DM Sans" fontSize="11" fill="#555350">given uncertainty about the competitor's cost</text>

      {/* Nature node at top */}
      <circle cx="300" cy="24" r="16" fill="#1a1a1a" stroke="rgba(200,240,96,0.3)" strokeWidth="1"/>
      <text x="300" y="28" textAnchor="middle" fontFamily="DM Mono" fontSize="10" fill="rgba(200,240,96,0.7)">N</text>
      <line x1="284" y1="30" x2="150" y2="65" stroke="rgba(200,240,96,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="316" y1="30" x2="450" y2="65" stroke="rgba(200,240,96,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
      <text x="200" y="52" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#555350">draws c₁</text>
      <text x="400" y="52" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#555350">draws c₂</text>
    </svg>
  )
}

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="hero-tag">
          <span className="tag-dot" />
          Research project — Florida State University
        </div>
        <h1 className="hero-title">
          Equilibrium pricing<br />under uncertainty
        </h1>
        <p className="hero-sub">
          A neural network that computes Bayesian Nash Equilibrium strategies
          for competing firms with private cost information.
        </p>
      </div>

      <div className="home-diagram-wrap">
        <div className="diagram-label">The game</div>
        <GameDiagram />
      </div>

      <div className="home-sections">
        <section className="home-section">
          <h2>What is the Bertrand game?</h2>
          <p>
            Two or more firms compete for customers by setting prices. Each firm wants to
            price high enough to make a profit, but low enough to win the sale. The classic
            result — <em>Bertrand's paradox</em> — says that with identical costs and
            complete information, competition drives prices all the way down to marginal cost.
          </p>
          <p>
            But real markets are not like that. Firms do not know each other's costs,
            supply chain efficiency, or capacity constraints. This private information
            changes everything.
          </p>
        </section>

        <section className="home-section">
          <h2>Private information and Bayesian equilibrium</h2>
          <p>
            When firms have <em>private cost information</em>, the game becomes a
            Bayesian game. Each firm knows its own cost, knows the distribution from
            which the competitor's cost is drawn, but does not observe the competitor's
            actual cost.
          </p>
          <p>
            The solution concept is the <strong>Bayesian Nash Equilibrium (BNE)</strong>:
            a pricing strategy β(c) for each firm such that, given that the competitor
            is also playing β, no firm can improve its expected profit by deviating.
            The strategy is a function — it maps every possible private cost to an
            optimal price.
          </p>
        </section>

        <section className="home-section">
          <h2>Why this is hard to compute</h2>
          <p>
            Finding β(c) requires solving a fixed-point problem over a space of functions.
            In simple settings the solution has a closed form. But with continuous type
            spaces, nonlinear demand, or more than two firms, analytical solutions
            become intractable.
          </p>
          <p>
            This project develops a <strong>deep learning approach</strong> to compute BNE
            strategies numerically. Each firm's strategy is parameterized by a neural
            network. An energy-based loss function — derived from the equilibrium
            conditions — is minimized jointly across all player networks. At the minimum,
            the networks represent a BNE.
          </p>
        </section>

        <section className="home-section">
          <h2>Demand model</h2>
          <div className="formula-block">
            <span className="formula">q<sub>i</sub> = α − β · c · Σ p<sub>j</sub></span>
            <div className="formula-params">
              <span>α = 500</span>
              <span>β = 1.0</span>
              <span>c = 0.3</span>
              <span>cost ~ U[80, 250]</span>
            </div>
          </div>
          <p>
            Each firm's quantity depends on all firms' prices through a linear demand
            function. The parameter c controls cross-price sensitivity — how much a
            competitor's price affects your demand.
          </p>
        </section>

        <section className="home-section">
          <h2>Real-world relevance</h2>
          <p>
            Private cost information is the norm, not the exception. Airlines do not
            publish their fuel contracts. Banks do not disclose their cost of capital.
            Retailers do not reveal their supplier agreements. Any market where firms
            compete on price and have asymmetric information is a Bayesian pricing game.
          </p>
          <p>
            The equilibrium strategy computed here tells a firm exactly how to price
            given its own cost — accounting for the full distribution of competitor costs
            and the equilibrium behavior of rational opponents.
          </p>
        </section>
      </div>

      <div className="home-cta">
        <div className="cta-card">
          <div className="cta-tag">Coming soon</div>
          <h3>Complete information</h3>
          <p>All firms' costs are publicly known. Equilibrium computed analytically. Compare with the Bayesian case.</p>
          <Link to="/complete" className="cta-btn cta-btn-ghost">View page →</Link>
        </div>
        <div className="cta-card cta-card-accent">
          <div className="cta-tag cta-tag-accent">Interactive</div>
          <h3>Incomplete information</h3>
          <p>Explore the NN-computed BNE strategy. Set your cost, see your optimal price and expected outcomes.</p>
          <Link to="/incomplete" className="cta-btn cta-btn-accent">Launch explorer →</Link>
        </div>
      </div>

      <footer className="home-footer">
        <span className="footer-mono">Andres E. Ho Lee</span>
        <span className="footer-sep">·</span>
        <span>Ph.D. Industrial Engineering, Florida State University</span>
        <span className="footer-sep">·</span>
        <span>Built with Python · TensorFlow · React</span>
      </footer>
    </div>
  )
}
