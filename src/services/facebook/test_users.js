import axios from 'axios';
import { faker } from '@faker-js/faker';

const appId = '1723269141315315';
const appSecret = '3680616783617af81e4a49dd6cc94aeb';

// Generate random user data
const userData = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
};

// Generate random photos
const photos = [];
for (let i = 0; i < 5; i++) {
  const photo = `https://picsum.photos/200/300?random=${i}`;
  photos.push(photo);
}

// Generate random content
const content = [];
for (let i = 0; i < 10; i++) {
  const post = {
    text: faker.lorem.paragraph(),
    photos: [photos[Math.floor(Math.random() * photos.length)]],
  };
  content.push(post);
}

// Retrieve test users
axios.get(`https://graph.facebook.com/v12.0/${appId}/accounts/test-users`, {
  params: {
    access_token: `${appId}|${appSecret}`,
  },
})
.then((response) => {
  console.log('Test users retrieved:', response.data);
  if (response.data.data.length === 0) {
    // Create test user account
    axios.post(`https://graph.facebook.com/v12.0/${appId}/accounts/test-users`, {
      name: userData.name,
      installed: true,
    }, {
      params: {
        access_token: `${appId}|${appSecret}`,
      },
    })
    .then((response) => {
      console.log('Test user created:', response.data);
    })
    .catch((error) => {
      console.error('Error creating test user:', error.response?.data || error.message);
    });
  } else {
    console.log('Test users exist, deleting...');
    response.data.data.forEach((testUser) => {
      axios.delete(`https://graph.facebook.com/v12.0/${testUser.id}`, {
        params: {
          access_token: `${appId}|${appSecret}`,
        },
      })
      .then((response) => {
        console.log(`Deleted test user: ${testUser.id}`);
      })
      .catch((error) => {
        console.error(`Error deleting test user: ${error}`);
      });
    });
  }
})
.catch((error) => {
  console.error('Error retrieving test users:', error.response?.data || error.message);
});