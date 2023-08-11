import { request } from '@/utils'

export default {
  getCommossionDetail: (id) => request.get(`/commossion/selectById/${id}`),
  getDepartmentList: () => request.get(`/department/list`),
  updatePwd: (param) => request.post(`/commossion/alterPassWord`, param),
  updateUserinfo: (param) => request.put(`/commossion/admin/update`, param),
}
