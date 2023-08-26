import request from '@/utils/request'
/**
 * 获取数据字典数据
 * @param url
 * @returns
 */
export const getDictData = (type:string) => {
  let url = '/api/dict/data/getByDictType/'+type;
  return request({
    url,
    method: 'GET'
  },false)
}
