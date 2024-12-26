// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'claude-3-5-sonnet-latest',
    label: 'Claude 3.5 Sonnet',
    apiIdentifier: 'claude-3-5-sonnet-latest',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'o1-preview',
    label: 'O1 Preview',
    apiIdentifier: 'o1-preview',
    description: 'Large model for complex tasks',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'claude-3-5-sonnet-latest';