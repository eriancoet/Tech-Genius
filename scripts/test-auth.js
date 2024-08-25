import { signIn } from 'next-auth/react';

async function testSignIn() {
  try {
    console.log('Attempting sign in...');

    const result = await signIn('credentials', {
      redirect: false,
      email: 'hradmin@test.com',
      password: 'TestPass1234',
    });

    console.log('Sign-in result:', result);

    if (result?.error) {
      console.error('Sign-in error:', result.error);
    } else {
      console.log('Sign-in successful:', result);
    }
  } catch (error) {
    console.error('Sign-in test failed:', error);
  }
}

testSignIn();
