import { request } from '@/utils'

export default {
  getPage: (param) => request.post('/commossion/getListByStatus', param),
  passAudit: (param) => request.post('/serviceApply/passAudit', param),
  getDetail: (number) => request.get(`/serviceApply/getServiceApplyDetailById/${number}`),
  returnMaterial: (param) => request.post(`/serviceApply/passAuditNo`, param),
  complete: (param) => request.post('/serviceApply/complete', param),
  downloadZip: (serviceApplyId) =>
    request.get(`/file/pListDownload?serviceApplyId=${serviceApplyId}`),
}
