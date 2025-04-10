import axios from 'axios';

const appId = '';
const appSecret = '';
const testUserUrl = `https://graph.facebook.com/v12.0/${appId}/accounts/test-users`;

async function deleteTestUsers() {
  try {
    const response = await axios.get(testUserUrl, {
      params: {
        access_token: `${appId}|${appSecret}`,
      },
    });
    console.log('Test users retrieved:', response.data);
    const testUsers = response.data.data;
    for (const testUser of testUsers) {
      try {
        await axios.delete(`https://graph.facebook.com/v12.0/${testUser.id}`, {
          params: {
            access_token: `${appId}|${appSecret}`,
          },
        });
        console.log(`Deleted test user: ${testUser.id}`);
      } catch (error) {
        console.error(`Error deleting test user: ${error}`);
      }
    }
  } catch (error) {
    console.error(`Error retrieving test users: ${error}`);
  }
}

deleteTestUsers();