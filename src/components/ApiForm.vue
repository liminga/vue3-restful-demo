<template>
  <div>
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
    <button type="button" @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { reactive , ref, onBeforeMount } from 'vue'
import apiClient from '../utils/api';

const formData = reactive({
  email: '',
  password: '',
})
const responseMessage = ref('')

onBeforeMount(() => {
  getData()
})

const getData = async () => {
  const clientMessage = await apiClient.get('/', formData);
  const csrfCookie = await apiClient.get('/csrf-cookie');
  console.log(clientMessage)
  console.log(csrfCookie)
  localStorage.setItem('csrfCookie','aadb5e6f-0449-40fa-b3e7-b16772ef223e')
}


// 获取用户信息
const getUserInfo = async () => {
  const useInfo = await apiClient.get('/api/user', formData);
  localStorage.setItem('useInfo', useInfo)
}

// 提交
const submitForm = async () => {
  try {
    const response = await apiClient.post('/login', formData);
    responseMessage.value = `Success: ${response.data.message}`;
    getUserInfo()
  } catch (error) {
    responseMessage.value = 'Submission failed. Please try again.';
  }
}

// 退出
const logout = async () => {
  await apiClient.post('/logout');
  localStorage.removeItem('useInfo')
}

</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>