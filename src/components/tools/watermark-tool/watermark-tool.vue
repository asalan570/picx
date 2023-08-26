<template>
  <div class="watermark-tool-container" style="overflow-y: scroll;">
    <div class="watermark-tool-left" style="overflow-y: scroll;">

      <div class="getting-watermark-container"
        style="height: 160rem;width: auto;"
        @dragover.prevent
        @drop.stop.prevent="onDrop"
        @paste.stop="onPaste">
        <label for="input-file-selector"></label>
        <input
          id="input-file-selector"
          type="file"
          accept="image/*"
          @change="onSelect"
          multiple="multiple"
        />
        <div class="upload-area-tips">
          <el-icon class="icon"><IEpUploadFilled /></el-icon>
          <div class="text">{{ $t('upload.uploadAreaTips') }}</div>
        </div>
      </div>


      <img-process-state-card
        v-for="img in imgList"
        :img-obj="img"
        :key="img.uuid"
        card-type="watermark"
        @remove="remove"
      />
    </div>
    <div class="watermark-tool-right" :class="{ 'no-img': !imgList.length }" style="overflow-y: scroll;">
      <getting-watermark ref="gettingImagesRef" ></getting-watermark>

      <watermark-config-box
        @changeLayout="updateLayoutImage"
        :isTool="true"
        ref="waterMarkConfigFrame"
        style="margin-top: 18rem"
      />

      <div class="user-operate" :class="{ watermarked: isWatermarked && imgList.length > 1 }">
        <el-button
          v-if="isWatermarked && imgList.length > 1"
          plain
          type="success"
          @click="download"
        >
          {{ $t('toolbox.batch_download') }}
        </el-button>
        <div>
          <!-- <el-button  plain type="warning" @click="reset">
            {{ $t('reset') }}
          </el-button> -->
          <el-button
            :disabled="watermarking || isWatermarked || imgList.length < 1"
            plain
            type="primary"
            @click="addWatermark"
          >
            {{ $t('toolbox.add_watermark') }}
          </el-button>
        </div>
      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import { computed,reactive, ref, watch,onMounted,onUnmounted } from 'vue'
import {
  ImageHandleResult,
  ImgProcessStateModel,
  UserSettingsModel,
  WatermarkPositionEnum
} from '@/common/model'
import { addWatermarkToImage, downloadImage, imgFileToBase64,gettingFilesHandle, isImage,blobToBase64ByImageUrl,base64ToFile } from '@/utils'
import { useStore } from '@/stores'

const store = useStore()
const updateLayoutImage = (url: string) => {
  gettingImagesRef.value.changeLayout(url);
}

const watermarkConfig = reactive<UserSettingsModel['watermark']>({
  enable: true,
  text: '',
  fontSize: 0,
  opacity: 0,
  position: WatermarkPositionEnum.rightBottom,
  textColor: ''
})

const gettingImagesRef = ref<any>(null)
const waterMarkConfigFrame = ref<any>(null)

const imgList = ref<ImgProcessStateModel[]>([])

const watermarking = ref<boolean>(false)
const isWatermarked = ref<boolean>(false)

const unifiedHandle = async (files: File[]) => {
  if (!files.length) {
    return
  }

  imgList.value = []

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const res = await gettingFilesHandle(file)
    if (res) {
      imgList.value.push(res)
    }
  }
  setCurImg()

  store.commit('CHANGE_UPLOAD_AREA_ACTIVE', true)
  getImgList(imgList.value)
}
const onPaste = async (e: any) => {
  const files = Array.from(e.clipboardData.items)
    .filter((v: any) => v.kind === 'file' && isImage(v.type))
    .map((x: any) => x.getAsFile())
  await unifiedHandle(files)
}
const onSelect = async (e: any) => {
  const input = e.target
  await unifiedHandle(input.files)
  input.value = '' // 清空 input 元素的 value 属性，强制每次触发 onchange 事件
  input.value = input.defaultValue
}
const curShowImg = ref<{ uuid: string; base64: string }>({
  uuid: '',
  base64: ''
})
const setCurImg = () => {
  const len = imgList.value.length
  const tmpImg = len > 0 ? imgList.value[len - 1] : { uuid: '', base64: '' }
  curShowImg.value = {
    uuid: tmpImg.uuid,
    base64: tmpImg.base64
  }
}

const onDrop = async (e: any) => {
  await unifiedHandle(e.dataTransfer.files)
}

const getImgList = (imgs: ImageHandleResult[]) => {
  isWatermarked.value = false
  watermarking.value = false
  imgs.forEach((x) => {
    store.dispatch('TOOLBOX_IMG_LIST_ADD', {
      uuid: x.uuid,
      originalName: x.file.name,
      originalSize: x.file.size,
      originalBase64: x.base64,
      originalFile: x.file
    })
  })
}

// 设置水印配置
const setWatermarkConfig = (config: UserSettingsModel['watermark']) => {
  watermarkConfig.text = config.text
  watermarkConfig.textColor = config.textColor
  watermarkConfig.opacity = config.opacity
  watermarkConfig.position = config.position
  watermarkConfig.fontSize = config.fontSize
  isWatermarked.value = false
}

// 重置
const reset = () => {
  store.dispatch('TOOLBOX_IMG_LIST_RESET')
  isWatermarked.value = false
  gettingImagesRef.value?.reset()
}

// 添加水印
const addWatermark = async () => {
  watermarking.value = true
  // eslint-disable-next-line no-restricted-syntax
  // for (const img of imgList.value) {
  //   img.processing = true
  //   img.finialFile = (await addWatermarkToImage(img.originalFile, watermarkConfig)) as File
  //   img.finialBase64 = (await imgFileToBase64(img.finialFile)) || ''
  //   img.finialSize = img.finialFile.size
  //   img.finialName = img.finialFile.name
  //   img.processing = false
  // }
  // isWatermarked.value = true
  // watermarking.value = false
  for (const img of imgList.value) {
    img.processing = true
  }
  for (const img of imgList.value) {
    const res = await  waterMarkConfigFrame.value.addWatermarkToImage(img.originalBase64,img.originalFile.name)
    const fileBase64 = await blobToBase64ByImageUrl(res)
    // img.processing = true
    img.finialFile = (base64ToFile(fileBase64,img.originalFile.name)) as File
    img.finialBase64 = (await imgFileToBase64(img.finialFile)) || ''
    img.finialSize = img.finialFile.size
    img.finialName = img.finialFile.name
    img.processing = false
  }
  isWatermarked.value = true
  watermarking.value = false
}

// 下载
const download = () => {
  imgList.value.forEach((v: ImgProcessStateModel) => {
    downloadImage(v.finialFile as File)
  })
}

// 删除
const remove = (uuid: string) => {
  store.dispatch('TOOLBOX_IMG_LIST_REMOVE', uuid)
  gettingImagesRef.value?.remove(uuid)
}

watch(
  () => store.state.toolboxImageListModule.toolboxImageList,
  (newValue) => {
    imgList.value = newValue
  },
  {
    immediate: true,
    deep: true
  }
)
onMounted(() => {
  window.addEventListener('paste', onPaste)
})

onUnmounted(() => {
  window.removeEventListener('paste', onPaste)
})

defineExpose({ reset, remove })

</script>

<style scoped lang="stylus">
@import "./watermark-tool.styl"
@import "../../getting-watermark/getting-watermark.styl"
</style>
