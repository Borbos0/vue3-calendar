<script setup>
import { ref } from 'vue'
import Calendar from './components/Calendar.vue'
import { formatYMD } from './utils/utils'

const model = ref(formatYMD(new Date()))
const locale = ref('ru')

function setToday() {
  model.value = formatYMD(new Date())
}

function onSelect(payload) {
  console.log(payload)
}
</script>

<template>
  <div class="app">
    <h1>Календарь (Vue 3)</h1>  
      <div class="container">
        <label>
          Язык:
          <select v-model="locale">
            <option value="ru">ru</option>
            <option value="en">en</option>
          </select>
        </label>
        <button @click="setToday">Сегодня</button>
        <span class="current">Выбрано: {{ model }}</span>
      </div>  
    <Calendar
      v-model="model"
      :locale="locale"
      @select="onSelect"
    />
  </div>
</template>

<style scoped>
h1 {
  color: white;
}

select {
  outline: none;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  padding-bottom: 12px;
  color: white;
  font-size: 18px;
}
</style>
