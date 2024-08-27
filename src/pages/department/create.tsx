import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';

const CreateDepartment: NextPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    managerId: '',
    status: 'active', // Default value for dropdown
  });

  const [errors, setErrors] = useState({
    name: '',
    managerId: '',
    status: '',
  });

  const router = useRouter();
  const createDepartment = trpc.department.create.useMutation({
    onSuccess: () => {
      router.push('/department');
    },
    onError: (error) => {
      console.error('Error creating department:', error);
    },
  });

  const validateForm = () => {
    const newErrors: { [key in keyof typeof formData]: string } = {
      name: '',
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

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createDepartment.mutateAsync({
        ...formData,
        status: formData.status === 'active',
      });
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Create Department</h1>
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.name && <p className="text-red-500 text-sm col-span-3">{errors.name}</p>}

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

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 col-span-3"
            >
              Create Department
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateDepartment;
