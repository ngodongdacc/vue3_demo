<template>
  <div>
    <h2 v-if = "!state.id">Register</h2>
    <form>
      <div class="form-row row">
        <div class="form-group col-6">
          <label for="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            v-model="state.user.firstName"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('firstName') }"
          />
          <!-- <div v-if="submitted && errors.has('firstName')" class="invalid-feedback">
          {{ errors.first("firstName") }}
        </div> -->
          <span class="error-validate" v-if="v$.user.firstName.$error">
            {{ v$.user.firstName.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            v-model="state.user.lastName"
            name="lastName"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('lastName') }"
          />
          <!-- <div v-if="submitted && errors.has('lastName')" class="invalid-feedback">
          {{ errors.first("lastName") }}
        </div> -->
          <span class="error-validate" v-if="v$.user.lastName.$error">
            {{ v$.user.lastName.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="dob">Date of Birth</label>
          <input
            type="date"
            name="dob"
            v-model="state.user.dob"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('old') }"
          />
          <span class="error-validate" v-if="v$.user.dob.$error">
            {{ v$.user.dob.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="phone">Phone</label>
          <input
            type="text"
            name="phone"
            v-model="state.user.phone"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('old') }"
          />
          <span class="error-validate" v-if="v$.user.phone.$error">
            {{ v$.user.phone.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="email">Email</label>
          <input
            type="text"
            name="email"
            v-model="state.user.email"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('email') }"
          />
          <!-- <div v-if="submitted && errors.has('username')" class="invalid-feedback">
          {{ errors.first("username") }}
        </div> -->
          <span class="error-validate" v-if="v$.user.email.$error">
            {{ v$.user.email.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="username">Username</label>
          <input
            type="text"
            name="username"
            v-model="state.user.username"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('username') }"
          />
          <!-- <div v-if="submitted && errors.has('username')" class="invalid-feedback">
          {{ errors.first("username") }}
        </div> -->
          <span class="error-validate" v-if="v$.user.username.$error">
            {{ v$.user.username.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group col-6" v-if = "!state.id">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            v-model="state.user.password"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('password') }"
          />
          <!-- <div v-if="submitted && errors.has('password')" class="invalid-feedback">
          {{ errors.first("password") }}
        </div> -->
          <span class="error-validate" v-if="v$.user.password.$error">
            {{ v$.user.password.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group col-6" v-if = "!state.id">
          <label htmlFor="password">confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            v-model="state.user.confirmPassword"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('confirmPassword') }"
          />
          <!-- <div v-if="submitted && errors.has('password')" class="invalid-feedback">
          {{ errors.first("password") }}
        </div> -->
          <span class="error-validate" v-if="v$.user.confirmPassword.$error">
            {{ v$.user.confirmPassword.$errors[0].$message }}
          </span>
        </div>
      </div>
    </form>
    <div style="top: 20px; text-align: right;">
      <button
        class="btn btn-success"
        @click="submitForm"
        v-if="!state.id"
        style="margin-right: 20px"
      >
        Add {{ state.user.id }}
      </button>
      <button
        class="btn btn-success"
        @click="submitForm"
        v-if="state.id"
        style="margin-right: 20px"
      >
        Update
      </button>
      <router-link to="/" class="btn btn-secondary">Cancel</router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { reactive, computed } from "vue";
// import { helpers } from 'vuelidate/lib/validators'
// import { Form, Field } from 'vee-validate'
import useValidate from "@vuelidate/core";
import { required, email, minLength, sameAs, helpers } from "@vuelidate/validators";
import * as Yup from "yup";
import moment from "moment";

import URL from "@/config/url";

export default {
  setup() {
    const state = reactive({
      user: {
        firstName: "",
        lastName: "",
        dob: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      id: null,
      submitted: false,
    });

    const rules = computed(() => {
      if (state.id) {
        return {
          user: {
            firstName: {required, minLength: minLength(2) },
            lastName: {required, minLength: minLength(2) },
            dob: {},
            phone: {required, minLength: minLength(10)},
            email: {},
            username: { minLength: minLength(5) },
            password: {},
            confirmPassword: {},
          },
        };
      } else {
        return {
          // email: { required, email },
          user: {
            firstName: { required, minLength: minLength(2) },
            lastName: { required, minLength: minLength(2) },
            dob: { },
            phone: { required, minLength: minLength(10) },
            email: { required },
            username: { required, minLength: minLength(5) },
            password: { required, minLength: minLength(6) },
            confirmPassword: { required, sameAs: sameAs(state.user.password) },
          },
        };
      }
    });

    const v$ = useValidate(rules, state);

    return { state, v$ };
  },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        dob: "",
        confirmPassword: "",
      },
      id: null,
      submitted: false,
    };
  },
  created() {
    if (this.$route.params.id) {
      this.state.id = this.$route.params.id;
      this.getUser();
    }
    // console.log("this.state.id:: ", this.state.id);
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
    // ...mapActions('account', ['register']),
    // handleSubmit(e) {
    //     this.submitted = true;
    //     this.$validator.validate().then(valid => {
    //         if (valid) {
    //             this.register(this.user);
    //         }
    //     });
    // }
    submitForm() {
      this.v$.$validate(); // checks all inputs
      if (!this.v$.$error) {
        if (this.state.id) {
          this.editUser();
        } else {
          this.addUser();
        }
        // if ANY fail validation
      } else {
        // alert("Form failed validation");
      }
    },
    addUser() {
      const data = { ...this.state.user };
      delete data.confirmPassword;
      const addUserOtp = {
        method: "POST",
        data,
        url: URL.url_user,
      };
      this.$http(addUserOtp)
        .then((result) => {
          if (result && result.data) {
            // this.listUser = result.data.data;
              this.$toast.success(`Thêm người dùng thành công`);
            this.$router.push({ path: "/" });
          }
        })
        .catch((e) => {
          this.$toast.error(`Thêm người dùng thất bại`);
          console.log("err addUserOtp:: ", e);
        });
    },

    // lấy chi tiết user
    getUser() {
      if (this.state.id) {
        const listUserOtp = {
          method: "GET",
          params: {},
          url: `${URL.url_user}/${this.state.id}`,
        };
        this.$http(listUserOtp)
          .then((result) => {
            if (result && result.data && result.data.data) {
              this.state.user = result.data.data;
              this.state.user.dob = this.formatDate(this.state.user.dob, 'YYYY-MM-DD')
            }
          })
          .catch((e) => {
            console.log("err getListUser:: ", e);
          });
      }
    },

    // Cập nhật user
    editUser() {
      if (this.state.id) {
        const data = { ...this.state.user };
        delete data.password;
        delete data.confirmPassword;
        delete data.id;
        delete data.status;
        delete data.createdAt;
        delete data.updatedAt;
        const listUserOtp = {
          method: "PUT",
          data,
          url: `${URL.url_user}/${this.state.id}`,
        };
        this.$http(listUserOtp)
          .then((result) => {
            if (result && result.data) {
              this.$toast.success(`Cập nhật người dùng thành công`);
              this.$router.push({ path: "/" });
            }
          })
          .catch((e) => {
            this.$toast.error(`Cập nhật người dung thất bại`);
            console.log("err editUser:: ", e);
          });
      }
    },
    formatDate(value, format = "DD-MM-YYYY") {
      if (value && value !== "") {
        return moment(value).format(format);
      }
      return "";
    },
  },
};
</script>

<style>
.error-validate {
  color: red;
}
</style>
