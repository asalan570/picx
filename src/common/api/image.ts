import request from '@/utils/request'

/**
 * 上传图片并添加水印
 * @param url
 * @param data
 * @returns
 */
export const addWatermark = (data: any) => {
  const url = '/api/image/addWatermark';
  return request({
    url:url,
    method: 'POST',
    data:data
  },false)
}
