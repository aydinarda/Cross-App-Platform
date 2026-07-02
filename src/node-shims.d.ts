declare module 'node:fs' {
  export function existsSync(path: string): boolean;
  export function readdirSync(path: string): string[];
}

declare module 'node:crypto' {
  export function createHash(algorithm: string): {
    update(data: string): {
      digest(encoding: 'hex'): string;
    };
  };
}

declare module 'node:path' {
  const path: {
    join(...parts: string[]): string;
  };

  export default path;
}

declare const process: {
  cwd(): string;
  env: Record<string, string | undefined>;
};
