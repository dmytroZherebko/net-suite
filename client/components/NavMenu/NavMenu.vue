<template>
    <div v-if="$route.name !== 'authorize'">
        <ul class="nav">
           <li class="nav__item">
               <router-link to="documents" class="nav__link" active-class="nav__link_active">MY DOCS</router-link>
           </li>
        </ul>
    </div>
</template>

<script>
  export default {};
</script>