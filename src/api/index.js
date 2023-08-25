import { request } from '@/utils'

export default {
  upload: (param) => request.post('/file/upload', param)
}
