import CodexSplash from './components/CodexSplash'
import './App.css'

function App() {
  return (
    <CodexSplash>
      <div className="app-shell">
        <span className="app-shell__brand">CODEX</span>
        <div className="app-shell__headline">
          <h1>Codex</h1>
          <div className="app-shell__actions">
            <button className="app-shell__button app-shell__button--primary">
              Sign in with ChatGPT
            </button>
            <button className="app-shell__button">Use API Key</button>
          </div>
          <p className="app-shell__note">Cloud tasks disabled with API key</p>
        </div>
      </div>
    </CodexSplash>
  )
}

export default App
