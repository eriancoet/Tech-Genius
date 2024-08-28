import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import Layout from '../../../components/Layout';

const EditDepartment: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: department, isLoading } = trpc.department.getOne.useQuery({ id: id as string }, {
    enabled: !!id, // Only run query if ID is present
  });

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

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        managerId: department.managerId,
        status: department.status,
      });
    }
  }, [department]);

  const updateDepartment = trpc.department.update.useMutation({
    onSuccess: () => {
      router.push('/departments');
    },
    onError: (error) => {
      console.error('Error updating department:', error);
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
      await updateDepartment.mutateAsync({
        id: id as string,
        ...formData,
      });
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  if (isLoading || !department) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Edit Department</h1>
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex items-center space-x-4">
                <label className="text-sm font-semibold w-1/4">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                {key === 'status' ? (
                  <select
                    value={formData.status ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value === 'active',
                      })
                    }
                    className="border border-gray-300 p-2 rounded-md w-3/4"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="border border-gray-300 p-2 rounded-md w-3/4"
                  />
                )}
                {(errors as any)[key] && <p className="text-red-500 text-sm mt-1 w-3/4">{(errors as any)[key]}</p>}
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Update Department
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditDepartment;
