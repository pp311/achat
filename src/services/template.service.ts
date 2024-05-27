import ApiService from '@/services/api.service'
import type {Template} from '@/types/template'
import type { TemplateType } from '@/types/enum'


export async function getTemplates() {
  return ApiService.axiosCallWithAuth<Template[]>({
    method: 'GET',
    url: '/templates',
  });
}

export async function getTemplate(templateId: number) {
  return ApiService.axiosCallWithAuth<Template>({
    method: 'GET',
    url: `/templates/${templateId}`
  });
}

export async function lookupTemplate(type: TemplateType) {
  return ApiService.axiosCallWithAuth<Template[]>({
    method: 'GET',
    url: `/templates?type=${type}`
  });
}

export async function createTemplate(name: string, content: string, type: TemplateType) {
  return ApiService.axiosCallWithAuth<number>({
    method: 'POST',
    url: '/templates',
    data: {
      name,
      content,
      type
    }
  });
}

export async function updateTemplate(templateId: number, name: string, content: string) {
  return ApiService.axiosCallWithAuth<Template>({
    method: 'PUT',
    url: `/templates/${templateId}`,
    data: {
      name,
      content,
    }
  });
}

export async function deleteTemplate(templateId: number) {
  return ApiService.axiosCallWithAuth<Template>({
    method: 'DELETE',
    url: `/templates/${templateId}`
  });
}