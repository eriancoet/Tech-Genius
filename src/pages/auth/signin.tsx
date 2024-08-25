import { GetServerSideProps } from 'next';
import { getCsrfToken } from 'next-auth/react';

interface SignInProps {
  csrfToken: string;
}

const SignIn = ({ csrfToken }: SignInProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="flex flex-col space-y-4"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="email" className="w-1/3 text-right">Email:</label>
            <input
              id="email"
              name="email"
              type="text"
              required
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              style={{ width: '40%' }}
            />
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <label htmlFor="password" className="w-1/3 text-right">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              style={{ width: '40%' }}
            />
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
