import type { TemplateType } from '@/types/enum'

export interface Template{
  id: number;
  name: string;
  content: string;
  type: TemplateType;
}