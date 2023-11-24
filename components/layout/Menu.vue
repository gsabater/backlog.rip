<template>
  <h1 class="pt-4 mb-4 text-center text-white">
    <!-- Catas -->
    <img src="/img/ayc-logo.png" alt="" />
    <span
      style="font-size: 0.8rem; display: block; transform: translateY(-8px)"
      class="text-center text-disabled">
      Gestión de catas
    </span>
  </h1>
  <v-list>
    <v-list-item v-for="[icon, text, link] in links" :key="icon" link :to="link || ''">
      <template #prepend>
        <v-icon>{{ icon }}</v-icon>
      </template>

      <v-list-item-title>{{ text }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
/**
 * @file:    \components\layout\Menu.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 25th October 2023
 * Modified: Thu Nov 23 2023
 **/

export default {
  data() {
    return {
      drawer: null,
      thelinks: [
        ['mdi-monitor-dashboard', 'Inicio', '/dashboard'],
        ['mdi-account-box-outline', 'Empresas', '/clientes'],
        ['mdi-account-box', 'Usuarios', '/usuarios'],
        ['mdi-account-tie', 'Evaluadores', '/evaluadores'],
        // ['mdi-message-text-outline', 'Mensajes'],
        // ['mdi-folder-network-outline', 'Gestor documental', '/documentos'],
        // ['mdi-calendar-month-outline', '❌ Planificador', '/planificador'],

        ['mdi-code-braces', 'Parámetros', '/configuracion/parametros'],
        ['mdi-gradient-vertical', 'Fases', '/fases'],
        ['mdi-food-takeout-box-outline', 'Productos', '/productos'],
        ['mdi-palette-swatch-outline', 'Muestras', '/muestras'],
        ['mdi-square-circle', 'Sesiones de catas', '/sesiones'],
        // ['mdi-square-circle', 'Cálculos y resultados', '/calculos'],
        // ['', '---'],
        // ['mdi-inbox-arrow-down', 'Login', '/login'],
        // ['mdi-inbox-arrow-down', 'User', '/about'],
        // ['mdi-inbox-arrow-down', 'Tabla simple', '/solicitudes'],
        // ['mdi-inbox-arrow-down', 'Tabla aggrid', '/aggrid'],
      ],
    }
  },

  computed: {
    links() {
      if (this.$auth.isEvaluador)
        return [['mdi-monitor-dashboard', 'Inicio', '/dashboard']]
      if (!this.$auth.isAdmin)
        return this.thelinks.filter((link) => link[1] !== 'Empresas')

      return this.thelinks
    },
  },
}
</script>

<style scoped>
#toolbar {
  box-shadow: 0 1px 2px rgb(56 65 74 / 15%) !important;
}

.toolbar-offline {
  background: repeating-linear-gradient(
    -45deg,
    rgba(96, 108, 188, 0.25),
    rgba(96, 109, 188, 0.25) 10px,
    rgba(70, 82, 152, 0.25) 10px,
    rgba(70, 82, 152, 0.25) 20px
  );
}

#navbar {
  z-index: 7 !important;
  background-color: #445188;
}

/* .shadow-1 {
  border: 0px !important;
  -webkit-box-shadow: 0 1px 15px 1px rgba(69, 65, 78, 0.08) !important;
  box-shadow: 0 1px 15px 1px rgba(69, 65, 78, 0.08) !important;
} */
/*
.toolbar-div {
  height: 64px;
} */
/*
.toolbar-width-menu {
  background: #f5f5f5 !important;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.09) !important;
  color: #727891 !important;
  z-index: 1;
  right: 0;
  left: 275px;
  position: fixed;
} */
/*
.toolbar-no-menu {
  background: #f5f5f5 !important;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.09) !important;
  color: #727891 !important;
  z-index: 1;
  right: 0;
  left: 0;
  position: fixed;
} */

#menu .group-header {
  color: #838fb9;
  padding-left: 17px;
  margin: 0;
  height: 30px;

  letter-spacing: 0.05em;
  cursor: default;
  text-transform: uppercase;
  font-weight: 600;
}

#menu .v-list-group *,
#menu .v-list-item * {
  color: #7d8fb8;
  transition: color 0.5s ease;
}

#menu .v-list-group:hover *,
#menu .v-list-item:hover * {
  color: #fff;
}

#menu .v-item--active * {
  color: #fff;
}

#menu .v-list-item .v-list-group__header__prepend-icon {
  margin-right: 22px !important;
}

#menu .v-list-group .v-list-group__items .v-list-item__icon {
  margin: 0;
  padding: 0;
  width: 0;
  min-width: 4px;
  position: relative;
}

#menu .v-list-group .v-list-group__items .v-list-item__icon:before {
  content: '';
  width: 6px;
  height: 2px;
  background-color: #727891;
  position: absolute;
  left: -25px;
  top: 17.5px;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
  opacity: 0.5;
}
</style>
