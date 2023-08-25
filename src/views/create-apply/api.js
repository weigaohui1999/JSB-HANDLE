import { request } from '@/utils'

export default {
  getItemList: () => request.get(`/item/selectAll`),
  getApplyDetail: (id) => request.get(`/item/detail/${id}`),
  getCommossionPerson: (id) => request.get(`/commossion/listByItemId/${id}`),
  serviceApplyAdd: (param) => request.post(`/serviceApply/add`, param),
  passAudit: (param) => request.post('/document/entrust/sign', param)
}
