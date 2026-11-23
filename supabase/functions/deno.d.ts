// Ambient TypeScript declarations for Deno runtime globals
// Provides IntelliSense and clears editor diagnostics when viewed without the Deno extension.

// deno-lint-ignore-file
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    has(key: string): boolean;
    toObject(): Record<string, string>;
  }

  export const env: Env;

  export interface ServeOptions {
    port?: number;
    hostname?: string;
    signal?: AbortSignal;
    onError?: (error: unknown) => Response | Promise<Response>;
    onListen?: (params: { hostname: string; port: number }) => void;
  }

  export function serve(
    handler: (request: Request, info?: unknown) => Response | Promise<Response>
  ): void;
  export function serve(
    options: ServeOptions,
    handler: (request: Request, info?: unknown) => Response | Promise<Response>
  ): void;
}
