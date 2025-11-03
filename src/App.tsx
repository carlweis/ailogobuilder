import CodexSplash from './components/CodexSplash'
import './App.css'

function App() {
  return (
    <CodexSplash>
      <div className="app-shell">
        <span className="app-shell__brand">OpcodeZero</span>
        <div className="app-shell__headline">
          <h1>AI Logo Builder</h1>
          <div className="app-shell__actions">
            <button className="app-shell__button app-shell__button--primary">
              Generate a new Logo
            </button>
            <button className="app-shell__button">Browse Logos</button>
          </div>
          <p className="app-shell__note">Built with ❤️ and AI.</p>
        </div>
      </div>
    </CodexSplash>
  )
}

export default App
