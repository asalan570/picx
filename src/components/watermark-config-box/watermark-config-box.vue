<template>
  <el-form
    class="watermark-config-form"
    label-position="left"
    label-width="90rem"
    :disabled="disabled"
  >
    <el-row>
      <el-col :span="24">
        <el-form-item :label="$t('settings.img_watermark.text_layout')">
          <el-select v-model="pram.layout" placeholder="选择布局" @change="changeLayout">
            <el-option
              v-for="item in layoutOptions"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('settings.img_watermark.position_1')">
          <el-select v-model="pram.left_top" placeholder="左上角显示" >
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="pram.left_top == 'Custom'">
        <el-form-item :label="$t('settings.img_watermark.position_4')">
          <el-input style="width: 64%;"
            v-model="pram.left_top_text"
            :placeholder="$t('settings.img_watermark.text_input_placeholder')"
            clearable
            maxlength="50"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('settings.img_watermark.position_2')">
          <el-select v-model="pram.left_bottom" placeholder="左下角显示">
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="pram.left_bottom == 'Custom'">
        <el-form-item :label="$t('settings.img_watermark.position_4')">
          <el-input style="width: 64%;"
            v-model="pram.left_bottom_text"
            :placeholder="$t('settings.img_watermark.text_input_placeholder')"
            clearable
            maxlength="50"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('settings.img_watermark.position_3')">
          <el-select v-model="pram.right_top" placeholder="右上角显示">
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="pram.right_top == 'Custom'">
        <el-form-item :label="$t('settings.img_watermark.position_4')">
          <el-input style="width: 64%;"
            v-model="pram.right_top_text"
            :placeholder="$t('settings.img_watermark.text_input_placeholder')"
            clearable
            maxlength="50"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('settings.img_watermark.position_4')">
          <el-select v-model="pram.right_bottom" placeholder="右下角显示">
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="pram.right_bottom == 'Custom'">
        <el-form-item :label="$t('settings.img_watermark.position_4')">
          <el-input style="width: 64%;"
            v-model="pram.right_bottom_text"
            :placeholder="$t('settings.img_watermark.text_input_placeholder')"
            clearable
            maxlength="50"
          />
        </el-form-item>
      </el-col>
      <el-collapse>
        <el-collapse-item title="更多">
          <el-col :span="24" >
            <el-form-item :label="$t('settings.img_watermark.position_white_margin')">
              <el-radio-group v-model="pram.more.white_margin" @change="changeHandler">
                <el-radio :label="1" :key="1">启用</el-radio>
                <el-radio :label="2" :key="2">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item :label="$t('settings.img_watermark.position_equivalent_focal_length')">
              <el-radio-group v-model="pram.more.equivalent_focal_length">
                <el-radio :label="1" :key="1">启用</el-radio>
                <el-radio :label="2" :key="2">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item :label="$t('settings.img_watermark.position_shadow')">
              <el-radio-group v-model="pram.more.shadow">
                <el-radio :label="1" :key="1">启用</el-radio>
                <el-radio :label="2" :key="2">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
      </el-collapse-item>
      </el-collapse>


    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, reactive,ref } from 'vue'
import FingerprintJS from '@fingerprintjs/fingerprintjs' // 引入
import { WatermarkPositionEnum } from '@/common/model'
import {
  getDictData,addWatermark
} from '@/common/api'
const notWhite = ref('https://cdn.staticaly.com/gh/asalan570/picx-images-hosting@master/布局-不启用白色边框.4j94wg9m3e20.webp')
const changeHandler = (res)=>{
  if(res == 2){
    emit('changeLayout',notWhite.value)
  }else{
    // console.log(pram.value.layout)
    emit('changeLayout',layoutImageMap.get(pram.value.layout))
  }

}
async function getvisitorId() {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      const visitorId = result.visitorId
      return visitorId;
      // console.log('唯一标识', visitorId)
    }
async function  addWatermarkToImage  (file: string,fileName:string) : Promise<string | null>  {
  // console.log(getvisitorId())
  pram.value.file=file;
  pram.value.clientId= await getvisitorId()
  pram.value.fileName=fileName;
  // return file
  // console.log(pram.value);
  const res = await addWatermark(pram.value);
  // console.log("res:",res)
  return res.data
}
const pram = ref({
  clientId: '',
  layout:'watermark_left_logo',
  left_top:'LensModel',
  left_bottom:'Model',
  right_top:'Param',
  right_bottom:'Datetime',
  left_top_text:'',
  left_bottom_text:'',
  right_top_text:'',
  right_bottom_text:'Photo By somebody',
  more:{
    white_margin:1,
    equivalent_focal_length:2,
    shadow:2
  },
  file:'',
  fileName:''
})
const options =ref([])
const layoutOptions =ref([])
const layoutImageMap = new Map()

const emit = defineEmits(["changeLayout"])

const changeLayout = (item) =>{
  //修改示例图片
  emit('changeLayout',layoutImageMap.get(item))
}

const getDictDatas = async ()=>{
  const type = 'pram';
  const res = await getDictData(type);
  for(let i = 0;i < res.data.length;i++){
    options.value.push(res.data[i])
  }
}
const getDictLayoutDatas = async ()=>{
  const type = 'layout';
  const res = await getDictData(type);
  for(let i = 0;i < res.data.length;i++){
    layoutOptions.value.push(res.data[i])
    layoutImageMap.set(res.data[i].value,res.data[i].remark)
  }

}
onMounted(() => {
  getDictDatas()
  getDictLayoutDatas()
})
defineExpose({
  addWatermarkToImage
	})



const watermark = reactive({
  text: '',
  fontSize: 0,
  position: WatermarkPositionEnum.rightBottom,
  textColor: '',
  opacity: 0
})

defineProps({
  isTool: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})



</script>
