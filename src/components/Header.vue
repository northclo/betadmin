<template>
  <a-layout-header class="white-background">
  </a-layout-header>
</template>

<script setup>

// Correctly define props without assigning to unused variable
defineProps({
  collapsed: Boolean
});
</script>

<script>

export default {
  name: 'HeaderPage'
} 
</script>
