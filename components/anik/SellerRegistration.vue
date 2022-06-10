<template>
  <div class="row mt-5">
    <div class="col-lg-8 px-0 pr-lg-3">
      <div class="seller-registration-form bg-light-grey rounded-10 p-3">
        <h3 class="fw-500 text-dark">Seller Registration</h3>
        <div class="row mt-4">
          <div class="col-lg-6 px-0 px-lg-2">
            <b-form-group>
              <label class="footy-label" for="full-name">Your Name</label>
              <b-form-input
                b-input
                v-model="form.name"
                label="Full Name"
                id="full-name"
                class="mb-2 footy-input"
                placeholder="Full Name"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-lg-6 px-0 px-lg-2">
            <b-form-group>
              <label class="footy-label" for="user-name">Username</label>
              <b-input-group prepend="@" class="footy-input-prepend">
                <b-form-input
                  b-input
                  v-model="form.username"
                  label="Username"
                  id="user-name"
                  class="mb-2 footy-input"
                  placeholder="Username"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </div>
          <div class="col-12 px-0 px-lg-2">
            <label for="description" class="mb-2">Profile Description</label>
            <div>
              <textarea
                type="text"
                class="footy-textarea w-100"
                placeholder="A cool Profile!"
                v-model="form.description"
                id="description"
                rows="5"
              />
            </div>
          </div>
          <div class="col-lg-5 mt-1 mt-lg-4 px-0 px-lg-2">
            <div class="dashboard-profile-select-image">
              <label for="profile-image" class="cursor-pointer fs-14">
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
          <div class="col-lg-7 px-0 px-lg-2 text-lg-right text-center mt-4">
            <div
              class="d-flex flex-wrap justify-content-center justify-content-lg-end gap-10"
            >
              <b-button variant="white" class="footy-button border">
                Cancel
              </b-button>
              <b-button variant="primary" class="footy-button px-3">
                Create a Seller Account
              </b-button>
            </div>
          </div>
          <div class="col-12 pt-5 pb-4">
            <p class="text-center">
              By creating a seller account, you agree to our
              <nuxt-link :to="{name: 'anik'}" class="text-primary">
                terms of service.
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 d-none d-lg-block">
      <div class="seller-registration-info bg-light-grey rounded-10 p-3">
        <h3 class="fw-600 mb-4">Excited? here is how it works!</h3>
        <ul class="pl-5 pr-3">
          <li class="mb-5" v-for="(data, key) in info" :key="`info-${key}`">
            <h6>{{ key + 1 }}</h6>
            <h5 class="fw-600 fs-18 mb-2">{{ data.title }}</h5>
            <p class="fs-14">{{ data.text }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import IconCamera from '~/static/images/camera.svg';
export default {
  name: 'seller-registration',
  components: {
    IconCamera,
  },

  data() {
    return {
      preview: '',
      info: [
        {
          title: 'Create your seller account.',
          text: 'It takes just 30 seconds to get started.',
        },
        {
          title: 'Sell your already created strategies.',
          text: 'List any strategy from your account for sale.',
        },
        {
          title: 'Get paid while helping others.',
          text: 'Other amigos are waiting to pay for your profitable strategies.',
        },
      ],
      form: {
        name: '',
        username: '',
        description: '',
        image: '',
      },
    };
  },

  methods: {
    profileImage(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          this.preview = reader.result;
        };
        reader.readAsDataURL(file);
        this.form.image = file;
      }
    },
  },
};
</script>
