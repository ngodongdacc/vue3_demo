<template>
  <div>
    <h2 v-if="!id">Register</h2>
    <form>
      <div class="form-row row">
        <div class="form-group col-6">
          <label for="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            v-model="user.firstName"
            @change="checkValue('firstName')"
            class="form-control"
          />
          <span class="error-validate" v-if="message.firstName">
            {{ message.firstName }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            v-model="user.lastName"
            name="lastName"
            @change="checkValue('lastName')"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('lastName') }"
          />
          <!-- <div v-if="submitted && errors.has('lastName')" class="invalid-feedback">
          {{ errors.first("lastName") }}
        </div> -->
          <span class="error-validate" v-if="message.lastName">
            {{ message.lastName }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="dob">Date of Birth</label>
          <input
            type="date"
            name="dob"
            v-model="user.dob"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('old') }"
          />
        </div>
        <div class="form-group col-6">
          <label for="phone">Phone</label>
          <input
            type="text"
            name="phone"
            @change="checkValue('phone')"
            v-model="user.phone"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('phone') }"
            @keypress="onlyNumber"
          />
          <span class="error-validate" v-if="message.phone">
            {{ message.phone }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="email">Email</label>
          <input
            type="text"
            name="email"
            v-model="user.email"
            @change="checkValue('email')"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('email') }"
          />
          <!-- <div v-if="submitted && errors.has('username')" class="invalid-feedback">
          {{ errors.first("username") }}
        </div> -->
          <span class="error-validate" v-if="message.email">
            {{ message.email }}
          </span>
        </div>
        <div class="form-group col-6">
          <label for="username">Username</label>
          <input
            type="text"
            name="username"
            v-model="user.username"
            @change="checkValue('username')"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('username') }"
          />
          <span class="error-validate" v-if="message.username">
            {{ message.username }}
          </span>
        </div>
        <div class="form-group col-6" v-if="!id">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            v-model="user.password"
            @change="checkValue('password')"
            class="form-control"
            :class="{ 'is-invalid': submitted && errors.has('password') }"
          />
          <!-- <div v-if="submitted && errors.has('password')" class="invalid-feedback">
          {{ errors.first("password") }}
        </div> -->
          <span class="error-validate" v-if="message.password">
            {{ message.password }}
          </span>
        </div>
        <div class="form-group col-6" v-if="!id">
          <label htmlFor="password">confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            v-model="user.confirmPassword"
            class="form-control"
            @change="checkValue('confirmPassword')"
            :class="{ 'is-invalid': submitted && errors.has('confirmPassword') }"
          />
          <span class="error-validate" v-if="message.confirmPassword">
            {{ message.confirmPassword }}
          </span>
        </div>
      </div>
    </form>
    <div style="top: 20px; text-align: right">
      <button
        class="btn btn-success"
        @click="submitForm"
        v-if="!id"
        style="margin-right: 20px"
      >
        Add {{ user.id }}
      </button>
      <button
        class="btn btn-success"
        @click="submitForm"
        v-if="id"
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
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";

import * as Yup from "yup";
import moment from "moment";
import http from "@/http";
import ajv from "@/ajv";
import URL from "@/config/url";

import bodySchema from "./bodySchema";

const schema = {
  type: "object",
  properties: {
    firstName: bodySchema.firstName,
    lastName: bodySchema.lastName,
    username: bodySchema.username,
    phone: bodySchema.phone,
    email: bodySchema.email,
    dob: bodySchema.dob,
    password: bodySchema.password,
    confirmPassword: bodySchema.confirmPassword,
  },
  required: ["firstName", "lastName", "username", "password", "confirmPassword"],
  additionalProperties: true,
};

const validate = ajv.compile(schema);
export default {
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        dob: "",
        confirmPassword: "",
      },
      message: {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        dob: "",
        confirmPassword: "",
      },
      id: null,
      submitted: false,
      msgPhone: "",
      msgEmail: "",
    };
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getUser();
    }
  },
  computed: {
    // ...mapState('account', ['status'])
  },

  methods: {
    // submit
    submitForm() {
      this.resetMessage();
      if (!this.id) {
        const valid = validate(this.user);
        if (!valid) {
          console.log("errors:: ", validate.errors);
          console.log("user:: ", this.user);
          validate.errors.forEach((err, index) => {
            let message = validate.errors[index].message;
            if (
              this.message[validate.errors[index].instancePath.replace("/", "")] === ""
            ) {
              // console.log("e:: ", validate.errors[index].instancePath.replace("/", ""));
              this.message[
                validate.errors[index].instancePath.replace("/", "")
              ] = message;
            }
          });
        } else {
          this.addUser();
        }
      } else {
        this.editUser();
      }
    },

    resetMessage() {
      this.message = {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        dob: "",
        confirmPassword: "",
        phone: "",
        email: "",
      };
    },
    // Thêm mới người dùng
    addUser() {
      const data = { ...this.user };
      delete data.confirmPassword;
      if (data && data.dob === "") {
        data.dob = null;
      }
      const addUserOtp = {
        method: "POST",
        data,
        url: URL.url_user,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      // Api
      http(addUserOtp)
        .then((result) => {
          if (result && result.status === 200 && result.data) {
            // this.listUser = result.data.data;
            this.$toast.success(`Thêm người dùng thành công`);
            this.$router.push({ path: "/" });
          } else if (
            result &&
            result.status === 400 &&
            result.data &&
            result.data.message
          ) {
            this.$toast.error(`${result.data.message}`);
          } else {
            this.$toast.error(`Thêm người dùng thất bại`);
          }
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.message) {
            this.$toast.error(`${e.response.data.message}`);
          } else {
            this.$toast.error(`Thêm người dùng thất bại`);
          }
          // console.log("err addUserOtp:: ", e.response);
        });
    },

    // Lấy chi tiết user
    getUser() {
      if (this.id) {
        const listUserOtp = {
          method: "GET",
          params: {},
          url: `${URL.url_user}/${this.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        http(listUserOtp)
          .then((result) => {
            if (result && result.data && result.data.data) {
              this.user = result.data.data;
              this.user.dob = this.formatDate(this.user.dob, "YYYY-MM-DD");
            }
          })
          .catch((e) => {
            console.log("err getListUser:: ", e);
          });
      }
    },

    // Cập nhật user
    editUser() {
      if (this.id) {
        const data = { ...this.user };
        delete data.password;
        delete data.confirmPassword;
        delete data.id;
        delete data.status;
        delete data.createdAt;
        delete data.updatedAt;
        const listUserOtp = {
          method: "PUT",
          data,
          url: `${URL.url_user}/${this.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        http(listUserOtp)
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

    // Định dạng ngày tháng
    formatDate(value, format = "DD-MM-YYYY") {
      if (value && value !== "") {
        return moment(value).format(format);
      }
      return "";
    },

    // Chỉ nhập số
    onlyNumber($event) {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },

    // Kiểm tra định dạng sdt
    phonenumber(event) {
      let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (event.target.value.match(phoneno)) {
        this.msgPhone = "";
        return true;
      } else {
        this.msgPhone = "Please enter a valid phone number";
        return false;
      }
    },

    checkValue(key) {
      this.message[key] = "";
      // console.log("key:: ", key);
      // console.log("user:: ", this.user);
      const valid = validate(this.user);
      if (!valid) {
        validate.errors.forEach((err, index) => {
          let message = validate.errors[index].message;
          if (validate.errors[index].instancePath === `/${key}`) {
            // console.log("e:: ", validate.errors[index].instancePath.replace("/", ""));
            this.message[key] = message;
          }
        });
      }
    },
  },
};
</script>

<style>
.error-validate {
  color: red;
}
</style>
