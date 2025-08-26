<template>
  <nav class="header-menu">
    <ul class="main-menu-wrapper">
      <li 
        v-for="(item, index) in menuItems" 
        :key="index" 
        :class="'menuitem-' + index"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="submenu-wrapper">
      <div
          v-for="(item, index) in menuItems" 
          :key="index" 
          :class="'menuitem-' + index"
      >
        <ul>
            <li v-for="(sub, i) in item.submenu" :key="i">{{ sub }}</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { inject, reactive } from 'vue'

const langState = inject('langState');
const t = reactive(langState.translations); // get translations

// Example menu items
const menuItems = [
  { label: t.main_page_menu, submenu: [ t.main_page_menu ] },
  { label: t.main_setting_menu, submenu: [t.MainSetting, 'Product B', 'Product C'] },
  { label: 'About' },
  { label: 'Contact' },
]

</script>

<style scoped>

.header-menu {

}
.header-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.header-menu li {
  position: relative;
  padding: 10px 20px;
  cursor: pointer;
}

.header-menu li {
  background-color: #f0f0f0;
}

.submenu-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  border: 1px solid #ddd;
  display: block;
  min-width: 150px;
}

.submenu li {
  padding: 8px 12px;
  white-space: nowrap;
}
</style>