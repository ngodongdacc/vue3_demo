<div>
  
</div>

<template>
  <div>
    <b-modal id="modal-center" centered title="BootstrapVue">
      <p class="my-4">Vertically centered modal!</p>
    </b-modal>
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
      submitted: false,
    });
    const rules = computed(() => {
      return {
        // email: { required, email },
        user: {
          firstName: { required, minLength: minLength(2) },
          lastName: { required, minLength: minLength(2) },
          dob: { required },
          phone: { required },
          email: { required },
          username: { required, minLength: minLength(5) },
          password: { required, minLength: minLength(6) },
          confirmPassword: { required, sameAs: sameAs(state.user.password) },
        },
      };
    });

    const v$ = useValidate(rules, state);

    return { state, v$ };
  },
  data() {
    return {
      user: {
        firstName: "dong",
        lastName: "",
        username: "",
        password: "",
        old: "",
        confirmPassword: "",
      },
      submitted: false,
    };
  },
  created() {
    console.log("user:: ", this.user.firstName);
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
      // console.log("this.v$:: ", this.user);
      //   if (!this.v$.$error) {
      //     // if ANY fail validation
      //     alert("Form successfully submitted.");
      //   } else {
      //     alert("Form failed validation");
      //   }
    },
  },
};
</script>

<style>
.error-validate {
  color: red;
}
</style>
