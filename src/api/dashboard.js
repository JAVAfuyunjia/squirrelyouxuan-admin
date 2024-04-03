import request from '@/utils/request'

export function info() {
  return request({
    url: '/admin/acl/index/dashboard',
    method: 'get',
  })
}
