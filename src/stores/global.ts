import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoginResponse, UserType } from '@/types/user'
import type { Source } from '@/types/source'

export const useGlobalStore = defineStore('global',  {
  state: ()=> ({
    user: ref<UserType | null>(null),
    role: ref<string>(''),
    confirmationModal: ref<{
      title: string,
      message: string,
      action: () => void
    }>({title: '', message: '', action: () => {}}),
    sources: ref<Source[]>([]),
  }),

  actions: {
    setUser(user: UserType) {
      this.user = user;
    },
    setRole(role: string) {
      this.role = role;
    },
    logout() {
      this.user = null;
      this.role = '';
    }
  }
})
