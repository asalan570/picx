import axios from './axios'
import axiosGithub from './axiosGithub'
import { CustomAxiosRequestConfig } from '@/common/model'

/**
 *
 * @param config 配置参数
 * @param github 是否请求github
 * @returns
 */
export default function request(config: CustomAxiosRequestConfig,github:boolean): Promise<any> {
  const requestConfig: CustomAxiosRequestConfig = {}

  // @ts-ignore
  config.method = config.method.toUpperCase()

  // eslint-disable-next-line no-restricted-syntax
  for (const configKey in config) {
    if (configKey === 'params') {
      if (config.method === 'GET') {
        requestConfig.params = config.params
      } else {
        requestConfig.data = config.params
      }
    } else {
      // @ts-ignore
      requestConfig[configKey] = config[configKey]
    }
  }
  if(github==null || github){
    return new Promise((resolve) => {
      axiosGithub
        .request(requestConfig)
        .then((res) => {
          const { status, data } = res
          if (res && (status === 200 || status === 201 || status === 204)) {
            resolve(data || 'SUCCESS')
          } else {
            resolve(null)
          }
        })
        .catch((err) => {
          if (requestConfig?.success422 && err?.status === 422) {
            resolve(err?.data || 'SUCCESS')
          } else {
            const code = err?.status
            const msg = err?.data?.message
            if (!requestConfig?.noShowErrorMsg) {
              console.error('PicX Error // ', err)
              if (code !== undefined && msg !== undefined) {
                ElMessage.error({ duration: 6000, message: `Code: ${code}, Message: ${msg}` })
              }
            }
            resolve(null)
          }
        })
    })
  }else{
    return new Promise((resolve) => {
      axios
        .request(requestConfig)
        .then((res) => {
          const { status, data } = res
          if (res && (status === 200 || status === 201 || status === 204)) {
            resolve(data || 'SUCCESS')
          } else {
            resolve(null)
          }
        })
        .catch((err) => {
          if (requestConfig?.success422 && err?.status === 422) {
            resolve(err?.data || 'SUCCESS')
          } else {
            const code = err?.status
            const msg = err?.data?.message
            if (!requestConfig?.noShowErrorMsg) {
              console.error('PicX Error // ', err)
              if (code !== undefined && msg !== undefined) {
                ElMessage.error({ duration: 6000, message: `Code: ${code}, Message: ${msg}` })
              }
            }
            resolve(null)
          }
        })
    })
  }


}
