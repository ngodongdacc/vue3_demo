<template>
  <div class="container">
    <!-- <h2>LOGIN</h2> -->
    <div class="login">
      <form>
        <div class="form-row">
          <div class="form-group col-12">
            <label for="username">Username</label>
            <input
              type="text"
              name="username"
              v-model="state.user.username"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors.has('username') }"
            />
            <span class="error-validate" v-if="v$.user.username.$error">
              {{ v$.user.username.$errors[0].$message }}
            </span>
          </div>
          <div class="form-group col-12">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              v-model="state.user.password"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors.has('password') }"
            />
            <span class="error-validate" v-if="v$.user.password.$error">
              {{ v$.user.password.$errors[0].$message }}
            </span>
          </div>
        </div>
      </form>
      <div class="btn-login">
        <button class="btn btn-success" style="width: 50%" @click="submitForm">Log In</button>
      </div>
    </div>
    <!-- <router-link to="/login" class="btn btn-link">Cancel</router-link> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { reactive, computed } from "vue";
// import { helpers } from 'vuelidate/lib/validators'
// import { Form, Field } from 'vee-validate'
import useValidate from "@vuelidate/core";
import http from "@/http";
import { required, email, minLength, sameAs, helpers } from "@vuelidate/validators";
import axios from "axios";
import qs from "qs";
import * as Yup from "yup";
import URL from "@/config/url";

export default {
  setup() {
    const state = reactive({
      user: {
        username: "",
        password: "",
      },
      submitted: false,
    });
    const rules = computed(() => {
      return {
        user: {
          username: { required, minLength: minLength(1) },
          password: { required, minLength: minLength(1) },
        },
      };
    });

    const v$ = useValidate(rules, state);

    return { state, v$ };
  },
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      submitted: false,
    };
  },
  created() {
    // console.log("user:: ", this.user.firstName);
  },
  computed: {
    // ...mapState('account', ['status'])
  },
  validations() {
    return {
      email: { required },
      user: {
        password: { required },
        confirm: { required },
      },
    };
  },
  methods: {
    submitForm() {
      this.v$.$validate(); 
      if (!this.v$.$error) {
        const data = {
          username: this.state.user.username,
          password: this.state.user.password,
        };
        // url_profile
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data,
          url: URL.url_sign_in,
        };
        axios(options)
          .then((result) => {
            if (result.data && result.data.token) {
              localStorage.setItem("token", result.data.token);
              this.$up("$http", http);
              this.$up("$loggedIn", 'true');
              const profileOpt = {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${result.data.token}`,
                },
                // data,
                url: URL.url_profile,
              };
              http(profileOpt)
                .then((profile) => {})
                .catch((e) => {
                  console.log("profile:: ", e);
                });
              this.$router.push({ path: "/" });
            }
          })
          .catch((e) => {
            console.log("e:: ", e);
          });
      } else {
        //   alert("Form failed validation");
      }
    },
  },
};
</script>

<style>
.error-validate {
  color: red;
}
.login {
  left: 50%;
  width: 300px;
  top: 300px;
  transform: translateX(-50%);
}
.btn-login {
  margin-top: 20px;
  text-align: center;
}
</style>
