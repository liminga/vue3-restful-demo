<template>
  <div>
    <div  v-if="!isLogin">
      <h1>Submit Data</h1>
      <form @submit.prevent="submitForm">
        <div>
          <label for="email">Email:</label>
          <input v-model="formData.email" id="email" type="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="formData.password" id="password" required />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p v-if="responseMessage">{{ responseMessage }}</p>
    </div>
    <div v-else>
      <div>
        <span>name:</span>
        <span>{{ useInfo.name }}</span>
      </div>
      <div>
        <span>email:</span>
        <span>{{ useInfo.email }}</span>
      </div>
      <button type="button" @click="logout">Logout</button>
    </div>
    </div>
</template>

<script setup>
import { reactive , ref, onBeforeMount } from 'vue'
import apiClient from '../utils/api';
import { deleteCookie } from '../utils/cookie';

const formData = reactive({
  email: '',
  password: '',
})
const responseMessage = ref('')
const isLogin = ref(false)
const useInfo = ref({})

onBeforeMount(() => {
  getData()
})

const getData = async () => {
  let use_info = localStorage.getItem('useInfo')
  if (use_info) {
    useInfo.value = JSON.parse(use_info)
    isLogin.value = true
  }
  await apiClient.get('/')
  await apiClient.get('/csrf-cookie')
}


// 获取用户信息
const getUserInfo = async () => {
  try {
    const result = await apiClient.get('/api/user', formData)
    localStorage.setItem('useInfo', JSON.stringify(result.data.data))
    useInfo.value = result.data.data
    isLogin.value = true
  } catch (error) {
    isLogin.value = false
  }
}

// 提交
const submitForm = async () => {
  try {
    await apiClient.post('/login', formData);
    responseMessage.value = `Success`;
    getUserInfo()
  } catch (error) {
    responseMessage.value = 'Submission failed. Please try again.';
  }
}

// 退出
const logout = async () => {
  await apiClient.post('/logout');
  localStorage.removeItem('useInfo')
  deleteCookie('XSRF-TOKEN')
  deleteCookie('demo_session')
  location.reload()
}

</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>