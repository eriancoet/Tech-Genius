import { GetServerSideProps } from 'next';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';

interface SignInProps {
  csrfToken: string;
}

const SignIn = ({ csrfToken }: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      csrfToken,
    });

    if (result?.error) {
      setError('Invalid username or password');
      console.error('Login error:', result.error);
    } else {
      // Redirect or do something on successful login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email:</label>
            <input
              id="email"
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {!email && <p className="text-red-500 mt-1">Email is required</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {!password && <p className="text-red-500 mt-1">Password is required</p>}
          </div>
          <button
            type="submit"
            className="w-36 mx-auto bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

// Fetch the CSRF token from the server
export const getServerSideProps: GetServerSideProps<SignInProps> = async (context) => {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken: csrfToken ?? '' }, // Handle case where csrfToken might be undefined
  };
};

export default SignIn;
