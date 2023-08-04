import { request } from '@/utils'

export default {
  login: (data) => request.post('/commossion/login', data, { noNeedToken: true }),
}
