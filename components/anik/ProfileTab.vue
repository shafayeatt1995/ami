<template>
  <div>
    <h3 class="fw-500 text-dark">Profile Settings</h3>
    <div class="row mt-4">
      <div class="col-lg-6 px-0 px-lg-2">
        <b-form-group>
          <label class="footy-label">Full Name</label>
          <b-form-input
            b-input
            v-model="profileForm.name"
            label="Full Name"
            id="full-name"
            class="mb-2 footy-input"
            placeholder="Full name Here"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-lg-6 px-0 px-lg-2">
        <b-form-group>
          <label class="footy-label">User Name</label>
          <b-input-group prepend="@" class="footy-input-prepend">
            <b-form-input
              b-input
              v-model="profileForm.userName"
              label="User Name"
              id="user-name"
              class="mb-2 footy-input"
              placeholder="User name here"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </div>
      <div class="col-lg-6 px-0 px-lg-2">
        <b-form-group>
          <label class="footy-label">User Email</label>
          <b-form-input
            b-input
            v-model="profileForm.email"
            label="User Email"
            id="user-email"
            class="mb-2 footy-input"
            placeholder="User name here"
            disabled
          ></b-form-input>
        </b-form-group>
      </div>
      <footy-dropdown-select
        v-model="profileForm.language"
        :options="languageOption"
        label="Language"
        id="Language"
        class="col-lg-6 mb-4 px-0 px-lg-2"
      />
      <div class="col-12 px-0 px-lg-2">
        <label for="description" class="mb-2">Description</label>
        <div>
          <textarea
            type="text"
            class="footy-textarea w-100"
            placeholder="Description"
            v-model="profileForm.description"
            id="description"
            rows="3"
          />
        </div>
      </div>
      <div class="col-lg-6 mt-4 px-0 px-lg-2">
        <div class="dashboard-profile-select-image">
          <label for="profile-image" class="cursor-pointer">
            <div class="profile-select-image">
              <img :src="preview" alt="avatar" v-if="preview" />
              <img
                src="/images/user.png"
                alt="avatar"
                class="img-fluid"
                v-else
              />
            </div>
            <i>
              <IconCamera />
            </i>
            <span class="text-Dark fw-500 ml-4">Change Profile Image</span>
          </label>
          <input
            type="file"
            class="d-none"
            id="profile-image"
            accept="image/*"
            @change="profileImage($event)"
          />
        </div>
      </div>
      <div class="col-lg-6 px-0 px-lg-2 text-lg-right text-center mt-4">
        <div class="profile-setting-submit-button-group">
          <b-button variant="white" class="footy-button border">
            Cancel
          </b-button>
          <b-button variant="primary" class="footy-button">
            Save Changes
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IconCamera from '~/static/images/camera.svg';

export default {
  name: 'seller-profile-tab',
  components: {
    IconCamera,
  },
  data() {
    return {
      languageOption: [
        {
          value: 'en',
          text: 'English',
        },
        {
          value: 'de',
          text: 'German',
        },
        {
          value: 'fr',
          text: 'French',
        },
      ],
      preview: '',
      profileForm: {
        name: '',
        userName: '',
        email: 'Daniel@footyamigo.com',
        language: '',
        description: '',
        avatar: '',
      },
    };
  },
  methods: {
    // show Selected image
    profileImage(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          this.preview = reader.result;
        };
        reader.readAsDataURL(file);
        this.profileForm.avatar = file;
      }
    },
  },
};
</script>
