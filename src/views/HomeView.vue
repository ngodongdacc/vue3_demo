<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="header-action">
      <i
        class="fa fa-trash icon"
        aria-hidden="true"
        v-if="checkedUser.length"
        v-on:click="alertDisplay"
        style="margin-right: 20px"
      ></i>
      <RouterLink to="/user"
        ><i class="fa fa-plus-circle icon" aria-hidden="true"
      /></RouterLink>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">ID</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Username</th>
          <th scope="col">Birth Day</th>
          <th scope="col">Email</th>
          <th scope="col">Phone</th>
          <th scope="col">CreatedAt</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in listUser">
          <th scope="row">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :value="item.id"
                :id="item.id"
                v-model="checkedUser"
              />
            </div>
          </th>
          <td>{{ item.id }}</td>
          <td>{{ item.firstName }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ item.username }}</td>
          <td>{{ formatDate(item.dob) }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.phone }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>
            <RouterLink :to="{ path: `/user/${item.id}` }"
              ><i class="fa fa-pencil-square-o" aria-hidden="true"></i
            ></RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="list-page">
      <b>count: {{ count }}</b>
    </div>
    <UserDetail ref="modal"></UserDetail>
  </main>
</template>

<script>
import TheWelcome from "@/components/TheWelcome.vue";
import { RouterLink } from "vue-router";
import axios from "axios";
import URL from "@/config/url";
import { getCurrentInstance } from "vue";
import moment from "moment";
import UserDetail from "./user/userDetail.vue";
import http from "@/http";

export default {
  setup() {},
  data() {
    return {
      listUser: [],
      id: "",
      checkedUser: [],
      count: 0,
      listPage: 1,
      page: 1,
    };
  },
  components: { UserDetail },
  created() {
    this.getListUser();
  },
  computed: {},

  methods: {
    // Lấy danh sách
    getListUser() {
      const listUserOtp = {
        method: "GET",
        params: {},
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        url: URL.url_user,
      };
      axios(listUserOtp)
        .then((result) => {
          if (result && result.data && result.data.data) {
            this.listUser = result.data.data;
            this.count = result.data.count;
          }
        })
        .catch((e) => {
          console.log("err getListUser:: ", e);
        });
    },

    // Xóa danh sách user
    removeUser() {
      const removeUserOtp = {
        method: "DELETE",
        data: {
          ids: this.checkedUser,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        url: URL.url_user,
      };
      http(removeUserOtp)
        .then((result) => {
          this.$toast.success(`Xóa người dùng thành công`);
          this.checkedUser = [];
          this.getListUser();
        })
        .catch((e) => {
          this.$toast.error(`Xóa người dùng thất bại`);
          console.log("err getListUser:: ", e);
        });
    },
    // cập nhật
    editUser(id) {
      this.id = id;
    },
    // Định dạng ngày-tháng-năm
    formatDate(value) {
      if (value && value !== "") {
        return moment(value).format("DD-MM-YYYY");
      }
      return "";
    },

    // Thông báo xóa bản ghi
    alertDisplay() {
      this.$swal
        .fire({
          title: "Bạn có chắc chắn muốn xóa người dùng",
          // text: "You won't be able to revert this!",
          // icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.removeUser();
            // this.$swal.fire("", "Xóa người dùng thành công", "success");
          } else {
            this.checkedUser = [];
          }
        });
    },

    showModal() {
      let element = this.$refs.modal.$el;
      element.modal("show");
    },
  },
};
</script>
<style>
.form-check-input {
  cursor: pointer;
}
.header-action {
  width: 100%;
  height: 30px;
  text-align: right;
}
.icon {
  font-size: 30px;
  cursor: pointer;
}
.icon:hover {
  font-size: 35px;
}
.fa-trash {
  color: red;
}
.fa-plus-circle {
  color: green;
}
.list-page {
  width: 100%;
  height: 30px;
  text-align: right;
}
</style>
