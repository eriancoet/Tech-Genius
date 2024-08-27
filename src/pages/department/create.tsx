import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';

const CreateDepartment: NextPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    managerId: '',
    status: false, 
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
      if (!formData[key as keyof typeof formData] && key !== 'status') {
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
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                {key === 'status' ? (
                  <div className="flex items-center space-x-4">
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="true"
                        checked={formData.status === true}
                        onChange={() => setFormData({ ...formData, status: true })}
                        className="mr-2"
                      />
                      Active
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="false"
                        checked={formData.status === false}
                        onChange={() => setFormData({ ...formData, status: false })}
                        className="mr-2"
                      />
                      Inactive
                    </label>
                  </div>
                ) : (
                  <input
                    type={key === 'name' ? 'text' : 'text'}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                )}
                {(errors as any)[key] && <p className="text-red-500 text-sm mt-1">{(errors as any)[key]}</p>}
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
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
