<template>
  <div class="cal" role="group" aria-label="Calendar">
    <div class="cal__header">
      <button class="cal__nav" @click="goPrevMonth" aria-label="Previous month"><</button>
      <div class="cal__title" aria-live="polite">
        {{ monthLabel }} {{ viewYear }}
      </div>
      <button class="cal__nav" @click="goNextMonth" aria-label="Next month">></button>
    </div>

    <div class="cal__weekdays">
      <div v-for="(day, index) in weekdays" :key="'wd'+index" class="cal__weekday">{{ day }}</div>
    </div>

    <div class="cal__grid">
      <button
        v-for="cell in grid"
        :key="cell.ymd"
        class="cal__day"
        :class="{
          'cal__day--muted': !cell.inCurrentMonth,
          'cal__day--today': cell.isToday,
          'cal__day--selected': cell.isSelected
        }"
        @click="onDayClick(cell)"
        :aria-pressed="cell.isSelected ? 'true' : 'false'"
        :aria-label="cell.ymd"
      >
        {{ cell.date.getDate() }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { formatYMD, isSameDate, parseYMD } from '../utils/utils'

const locales = {
  ru: {
    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    weekdaysMin: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
    firstDayOfWeek: 6,
  },
  en: {
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdaysMin: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    firstDayOfWeek: 7,
  },
}
const props = defineProps({
  modelValue: { type: String, default: '' },
  value: { type: String, default: '' },
  locale: { type: String, default: 'ru' },
  i18n: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'select'])

const today = new Date()

const initial = parseYMD(props.modelValue) || parseYMD(props.value) || today

const selected = ref(initial)
const viewYear = ref(initial.getFullYear())
const viewMonth = ref(initial.getMonth())

watch(() => props.modelValue, (date) => {
  const parsed = parseYMD(date)
  if (parsed) {
    selected.value = parsed
    viewYear.value = parsed.getFullYear()
    viewMonth.value = parsed.getMonth()
  }
})

watch(() => props.value, (date) => {
  if (props.modelValue) return
  const parsed = parseYMD(date)
  if (parsed) {
    selected.value = parsed
    viewYear.value = parsed.getFullYear()
    viewMonth.value = parsed.getMonth()
  }
})

const localeData = computed(() => {
  const base = locales[props.locale] || locales.ru
  return {
    months: props.i18n.months || base.months,
    weekdaysMin: props.i18n.weekdaysMin || base.weekdaysMin,
    firstDayOfWeek: typeof props.i18n.firstDayOfWeek === 'number'
        ? props.i18n.firstDayOfWeek
        : base.firstDayOfWeek,
  }
})

const monthLabel = computed(() => localeData.value.months[viewMonth.value])

const weekdays = computed(() => {
  const array = localeData.value.weekdaysMin.slice()
  const firstDay = localeData.value.firstDayOfWeek % 7
  return array.slice(firstDay).concat(array.slice(0, firstDay))
})

const grid = computed(() => {
  const result = []
  const firstOfMonth = new Date(viewYear.value, viewMonth.value, 1)
  const startOffset = (firstOfMonth.getDay() - localeData.value.firstDayOfWeek + 7) % 7
  const gridStart = new Date(viewYear.value, viewMonth.value, 1 - startOffset)

  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    const inCurrent = date.getMonth() === viewMonth.value && date.getFullYear() === viewYear.value
    result.push({
      date: date,
      ymd: formatYMD(date),
      inCurrentMonth: inCurrent,
      isToday: isSameDate(date, today),
      isSelected: isSameDate(date, selected.value),
    })
  }
  return result
})

function goPrevMonth() {
  const month = viewMonth.value - 1
  const date = new Date(viewYear.value, month, 1)
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}
function goNextMonth() {
  const month = viewMonth.value + 1
  const date = new Date(viewYear.value, month, 1)
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}
function onDayClick(cell) {
  selected.value = cell.date

  if (!cell.inCurrentMonth) {
    viewYear.value = cell.date.getFullYear()
    viewMonth.value = cell.date.getMonth()
  }

  const ymd = formatYMD(cell.date)
  emit('select', { date: ymd, nativeDate: cell.date })
  emit('update:modelValue', ymd)
}
</script>

<style scoped>
.cal {
    border: 1px solid #d0d7de;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
}

.cal__header {
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #eaeef2;
}

.cal__title {
    text-align: center;
    font-weight: 600;
    font-size: 18px;
}

.cal__nav {
    border: none;
    background: transparent;
    font-size: 18px;
    cursor: pointer;
    border-radius: 8px;
    padding: 6px 4px;
}

.cal__nav:hover {
    background: #f6f8fa;
}

.cal__weekdays, .cal__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.cal__weekdays {
    gap: 2px;
    padding: 6px 6px 0 6px;
}

.cal__weekday {
    text-align: center;
    font-size: 12px;
    color: #57606a;
    padding: 6px 0;
}

.cal__grid {
    gap: 6px;
    padding: 6px;
    padding-bottom: 10px;
}

.cal__day {
    aspect-ratio: 1 / 1;
    border: 1px solid transparent;
    border-radius: 10px;
    background: white;
    color: black;
    cursor: pointer;
    text-align: center;
    padding: 0;
    line-height: 1;
    font-size: 18px;
    outline: none;
}

.cal__day:hover {
    background: #f6f8fa; 
}

.cal__day--muted {
    color: #8c959f;
}

.cal__day--today {
    border-color: #0969da;
}

.cal__day--selected {
    border-color: aqua;
}

</style>