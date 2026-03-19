import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

export function useAuth() {
  const user = useStorage('user', {})
  const router = useRouter()

  const isLoggedIn = computed(() => !!user.value.token)

  const logout = () => {
    user.value = {}
    router.push('/')
  }

  return {
    user,
    isLoggedIn,
    logout
  }
}
