import ApiService from '@/services/api.service'
import type {Source} from '@/types/source'

export async function getSources() {
  return ApiService.axiosCallWithAuth<Source[]>({
    method: 'GET',
    url: `/sources`
  });
}

export async function connectGoogle(code: string) {
  return ApiService.axiosCallWithAuth<Source>({
    method: 'POST',
    url: `/sources/connect-google`,
    params: {code}
  });
}

export async function connectFacebook(accessToken: string) {
  return ApiService.axiosCallWithAuth<Source>({
    method: 'POST',
    url: `/sources/connect-facebook`,
    params: {accessToken}
  });
}

export async function disconnectFacebook(sourceId: number) {
  return ApiService.axiosCallWithAuth<Source>({
    method: 'POST',
    url: `/sources/disconnect-facebook`,
    params: {sourceId}
  });
}

export async function disconnectGoogle(sourceId: number) {
  return ApiService.axiosCallWithAuth<Source>({
    method: 'POST',
    url: `/sources/disconnect-google`,
    params: {sourceId}
  });
}