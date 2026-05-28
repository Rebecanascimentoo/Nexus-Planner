// ErrorBoundary (componente de classe) — captura erros de renderizacao nos filhos
// e exibe uma UI amigavel com botao de recarregar em vez de quebrar a pagina toda.

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  // Atualiza o estado quando um erro e lancado nos filhos
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
          <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/15 flex items-center justify-center mb-4">
            <span className="text-[#ef4444] text-2xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Algo deu errado</h2>
          <p className="text-sm text-white/50 mb-4">Tente recarregar a página</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
