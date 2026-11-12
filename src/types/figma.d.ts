declare module "figma" {
  export interface InstanceHandle {
    type: "INSTANCE";
    hasCodeConnect(): boolean;
    executeTemplate(): { example: unknown[]; metadata?: Record<string, unknown> };
    codeConnectId(): string | null;
  }

  export interface SelectedInstance {
    getString(name: string): string;
    getBoolean<T = boolean>(name: string, mapping?: { true: T; false: T }): T;
    getEnum<T = string>(name: string, mapping: Record<string, T>): T;
    getInstanceSwap(name: string): InstanceHandle | null;
    getSlot(name: string): unknown[] | undefined;
    findInstance(name: string, options?: { path?: string[]; traverseInstances?: boolean }): InstanceHandle | { type: "ERROR" };
    findText(name: string, options?: { path?: string[]; traverseInstances?: boolean }): { textContent: string; name: string } | { type: "ERROR" };
  }

  export const selectedInstance: SelectedInstance;
  export function code(strings: TemplateStringsArray, ...values: unknown[]): unknown[];

  const figma: {
    selectedInstance: SelectedInstance;
    code: (strings: TemplateStringsArray, ...values: unknown[]) => unknown[];
  };

  export default figma;
}

