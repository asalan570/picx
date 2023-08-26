<template>
  <div
    class="getting-watermark-container"
    @dragover.prevent
    style="float: right;">
    <img class="preview-img" :src="curShowImg" />
    <a >
        <div class="mask">
            <h3>{{ $t('feedback.text_7') }}</h3>
            <h4 style="color: black;padding: 5%;">{{ $t('feedback.text_8') }}</h4>
        </div>
    </a>

  </div>

</template>

<script setup lang="ts">
import { computed, ref,onMounted } from 'vue'
import { useStore } from '@/stores'

const store = useStore()

const uploadAreaActive = computed((): boolean => store.getters.getUploadAreaActive)

// const curShowImg = ref<{ uuid: string; base64: string }>({
//   uuid: '',
//   base64: ''
// })
const curShowImg = ref('https://cdn.staticaly.com/gh/asalan570/picx-images-hosting@master/布局——默认.230vu22ivnq8.webp')
const changeLayout = (url: string) => {
  curShowImg.value = url;
}
//暴露方法
defineExpose({
  changeLayout
	})

</script>

<style scoped lang="stylus">
@import "./getting-watermark.styl"
</style>
<style scoped>
.mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    vertical-align: auto;
    background: rgba(0, 0, 0, 0.1);
    color: #ffffff;
    opacity: 0;
    animation: maskframes 700ms ease-in-out forwards;
}
@keyframes maskframes {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
