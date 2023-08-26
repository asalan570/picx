<template>
  <div class="page-container feedback-page-container">
    <div class="help-info-item description">🏞️ {{ $t('feedback.text_5') }}</div>
    <div class="help-info-item description">🏞️ {{ $t('feedback.text_8') }}</div>

    <div class="help-info-item">
      🌍 {{ $t('feedback.text_2') }} {{ $t('shortcut_key') }}：<code>{{ shortcutKey }}</code>
    </div>

    <div class="help-info-item">
      🦁 {{ $t('author') }}：
      <el-link type="primary" href="https://asalan570.icu/" target="_blank">@AlanWu</el-link>
    </div>
<!--
    <div class="help-info-item">
      🌀 {{ $t('repo') }}：
      <el-link type="primary" href="https://github.com/XPoet/picx" target="_blank">
        https://github.com/XPoet/picx
      </el-link>
    </div> -->

    <div class="help-info-item">
      📖 {{ $t('feedback.text_6') }}：
      <el-link type="primary" href="https://picx-docs.xpoet.cn/usage-guide/get-start.html" target="_blank">
        https://picx-docs.xpoet.cn/usage-guide/get-start.html
      </el-link>
    </div>

    <!-- <div class="help-info-item" style="margin-bottom: 2rem">🎁 {{ $t('feedback.text_3') }}</div>

    <div class="help-info-item img">
      <el-image
        style="width: 300rem"
        src="https://cdn.staticaly.com/gh/asalan570/picx-images-hosting@master/1971692946322_.pic.7bwbdonbsrg0.webp"
      />
    </div> -->

    <div class="help-info-item red-text">
      <strong> ⚠️ {{ $t('feedback.text_4') }} </strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getOSName } from '@/utils'

const shortcutKey = computed(() => (getOSName() === 'win' ? 'Ctrl + D' : 'Command + D'))
</script>

<style scoped lang="stylus">
@import "./feedback-info.styl"
</style>
