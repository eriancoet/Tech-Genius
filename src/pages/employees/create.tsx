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
    status: 'active', // Default value for dropdown
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
        ...formData,
        status: formData.status === 'active',
      });
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Create Employee</h1>
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-semibold mb-1">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.firstName && <p className="text-red-500 text-sm col-span-3">{errors.firstName}</p>}

            <label className="text-sm font-semibold mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.lastName && <p className="text-red-500 text-sm col-span-3">{errors.lastName}</p>}

            <label className="text-sm font-semibold mb-1">Telephone Number</label>
            <input
              type="text"
              placeholder="Telephone Number"
              value={formData.telephoneNumber}
              onChange={(e) => setFormData({ ...formData, telephoneNumber: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.telephoneNumber && <p className="text-red-500 text-sm col-span-3">{errors.telephoneNumber}</p>}

            <label className="text-sm font-semibold mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.emailAddress && <p className="text-red-500 text-sm col-span-3">{errors.emailAddress}</p>}

            <label className="text-sm font-semibold mb-1">Manager ID</label>
            <input
              type="text"
              placeholder="Manager ID"
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.managerId && <p className="text-red-500 text-sm col-span-3">{errors.managerId}</p>}

            <label className="text-sm font-semibold mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm col-span-3">{errors.status}</p>}

            <div className="col-span-3 flex justify-end gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                style={{ width: '100px', padding: '10px' }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => router.push('/employees')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                style={{ width: '100px', padding: '10px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEmployee;
