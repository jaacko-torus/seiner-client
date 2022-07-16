import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
// To remove dark theme from large population
import "no-darkreader"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
