import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';

const CreateEmployee: NextPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    telephoneNumber: '',
    emailAddress: '',
    managerId: '',
    status: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    telephoneNumber: '',
    emailAddress: '',
    managerId: '',
    status: '',
  });

  const router = useRouter();
  const createEmployee = trpc.employee.create.useMutation({
    onSuccess: () => {
      router.push('/employees'); // Redirect to employee list page on success
    },
    onError: (error) => {
      console.error('Error creating employee:', error);
      if (error instanceof Error && error.message.includes('Unique constraint failed')) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailAddress: 'An employee with this email address already exists',
        }));
      }
    },
  });

  const validateForm = () => {
    const newErrors: { [key in keyof typeof formData]: string } = {
      firstName: '',
      lastName: '',
      telephoneNumber: '',
      emailAddress: '',
      managerId: '',
      status: '',
    };

    let hasError = false;

    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key as keyof typeof formData] = 'This field is required';
        hasError = true;
      }
    }

    if (formData.emailAddress && !/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Invalid email address';
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createEmployee.mutateAsync({
        ...formData,  // Remove userId
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      // Handle error display or additional logic here
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Create Employee</h1>
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type={key === 'emailAddress' ? 'email' : 'text'}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={(formData as any)[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                {(errors as any)[key] && <p className="text-red-500 text-sm mt-1">{(errors as any)[key]}</p>}
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Create Employee
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEmployee;
