/**
 * Client-side Google Identity Services helpers.
 * Loads the Google GSI script and initiates the sign-in popup flow.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, unknown>
          ) => void;
        };
      };
    };
  }
}

const GSI_URL = "https://accounts.google.com/gsi/client";

let scriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

export function loadGoogleScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Google script can only be loaded in a browser."));
      return;
    }

    const existing = document.querySelector(`script[src="${GSI_URL}"]`);
    if (existing) {
      scriptLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Google sign-in script."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Prompt the user to sign in with Google.
 * Returns the Google ID token string on success.
 */
export async function promptGoogleSignIn(clientId: string): Promise<string> {
  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error("Google Identity Services did not load."));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response.credential) {
          resolve(response.credential);
        } else {
          reject(new Error("Google sign-in was cancelled or failed."));
        }
      },
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.prompt();
  });
}

/**
 * Render the standard Google "Sign in with Google" button into a container element.
 */
export async function renderGoogleButton(
  container: HTMLElement,
  clientId: string,
  onToken: (idToken: string) => void,
  onError: (error: Error) => void
): Promise<void> {
  await loadGoogleScript();

  if (!window.google) {
    onError(new Error("Google Identity Services did not load."));
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response.credential) {
        onToken(response.credential);
      } else {
        onError(new Error("Google sign-in was cancelled or failed."));
      }
    },
  });

  window.google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "large",
    width: 340,
    text: "continue_with",
    shape: "rectangular",
  });
}
