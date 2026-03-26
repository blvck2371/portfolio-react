import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Contenu affiché en cas d'erreur (évite zone blanche) */
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary pour les canvas 3D : en cas d'erreur (texture, GLTF, WebGL),
 * affiche un fallback sombre au lieu d'une zone blanche.
 */
export class CanvasErrorFallback extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn("CanvasErrorFallback:", error.message, errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
