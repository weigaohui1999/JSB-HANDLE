import { request } from '@/utils'

export default {
  getItemList: (id) => request.get(`/item/listByDepId/${id}`),
}
