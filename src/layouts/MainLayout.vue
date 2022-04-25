<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          @click="$router.go(-1)"
          icon="arrow_back"
          label="Back"
          flat
          dense
        />

        <q-toolbar-title class="absolute-center">{{ title }}</q-toolbar-title>

        <q-btn
          v-if="!userDetails.userId"
          to="/auth"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          label="Login"
          no-caps
          flat
          dense
        />
        <q-btn
          v-else
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          @click="logoutUser"
        >
          Logout <br />
          {{ userDetails.name }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinOtherUserDetails from "../mixins/mixin-other-user-details.js";

export default {
  mixins: [mixinOtherUserDetails],
  computed: {
    ...mapState("store", ["userDetails"]),
    title() {
      let currentPath = this.$route.fullPath;
      if (currentPath == "/") return "SmartChat";
      else if (currentPath.includes("/chat")) return this.otherUserDetails.name;
      else if (currentPath == "/auth") return "Login";

      return "SmartChat";
    },
  },
  methods: {
    ...mapActions("store", ["logoutUser"]),
  },
};
</script>

<style lang="stylus">
.q-toolbar
  .q-btn
    line-height 1.2;
</style>
