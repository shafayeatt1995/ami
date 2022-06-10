<template>
  <div class="avatar-dropdown">
    <b-button class="avatar" @click="is_open = !is_open">
      <b-img :src="avatar_link"> </b-img>
    </b-button>
    <div v-show="is_open" class="avatar-dropdown-menu rounded-border">
      <div class="title">
        <h5>Account</h5>
        <b-button class="footy-button" @click="is_open = false">
          <CloseIcon />
        </b-button>
      </div>
      <b-list-group class="list-group">
        <b-list-group-item to="/profile" class="group-item">
          <div class="text">
            <div class="icon-background">
              <ProfileIcon />
            </div>
            <p class="align-middle">Profile</p>
          </div>
          <SideIcon />
        </b-list-group-item>
        <b-list-group-item
          class="group-item"
          :to="is_seller ? '/seller-dashboard' : '/become-seller'"
          v-if="$store.getters.is_tester"
        >
          <div class="text">
            <div class="icon-background">
              <DollarIcon />
            </div>
            <p class="align-middle">
              {{ is_seller ? 'Seller Dashboard' : 'Become A Seller' }}
            </p>
          </div>
          <SideIcon />
        </b-list-group-item>
        <b-list-group-item to="/profile/help" class="group-item">
          <div class="text">
            <div class="icon-background">
              <QuestionMarkIcon />
            </div>
            <p class="align-middle">Get Help</p>
          </div>
          <SideIcon />
        </b-list-group-item>
        <b-list-group-item to="#" @click="logOut" class="group-item logout">
          <div class="text">
            <div class="icon-background">
              <QuitIcon />
            </div>
            <p class="align-middle" style="color: #dc6060">Logout</p>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'AvatarDropdown',
  data() {
    return {
      is_open: false,
    };
  },

  computed: {
    ...mapGetters(['is_seller']),

    avatar_link() {
      return `/svg/${this.$auth.user.avatar_id}.svg`;
    },
  },

  methods: {
    async logOut() {
      await this.$axios.$get('/user/logout');
      window.location.replace('/auth/login');
    },
  },
};
</script>

<style lang="scss">
.avatar-dropdown {
  position: relative;
  .avatar-dropdown-menu {
    position: absolute;
    right: 0;

    width: 300px;
    padding: 15px;
    background: white;
    border: 1px solid #eef5ed;
    box-shadow: 0px 10px 35px rgba(0, 0, 0, 0.05);
    z-index: 1;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .list-group {
      display: flex;
      flex-direction: column;
      .group-item {
        margin: 0px 8px;
        padding: 10px;
        vertical-align: middle;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: #60685f;
        border: none;
        .text {
          display: flex;
          align-items: center;
          .icon-background {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 28px;
            height: 28px;
            background: #eef5ed;
          }
          p {
            padding: 5px 0px;
            margin-left: 20px;
            font-weight: 500;
            font-size: 15px;
            color: #60685f;
          }
        }
      }
      .logout {
        box-shadow: 0px -1px 0px #eef5ed;
      }
    }
  }
}
@media screen and (max-width: $lg) {
  .avatar-dropdown {
    .avatar-dropdown-menu {
      left: 0;
      top: 55px;
    }
  }
}
</style>
