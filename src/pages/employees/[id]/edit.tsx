import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc'; // Adjust path as needed
import Layout from '../../../components/Layout';

const EditEmployee: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

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

  const { data, isLoading, isError } = trpc.employee.getAll.useQuery();
  const updateEmployee = trpc.employee.update.useMutation({
    onSuccess: () => {
      router.push('/employees'); // Redirect to employee list page on success
    },
    onError: (error: any) => {
      console.error('Error updating employee:', error);
      if (error instanceof Error && error.message.includes('Unique constraint failed')) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailAddress: 'An employee with this email address already exists',
        }));
      }
    },
  });

  useEffect(() => {
    if (data && id) {
      const employee = data.find(emp => emp.id === id);
      if (employee) {
        setFormData({
          firstName: employee.firstName,
          lastName: employee.lastName,
          telephoneNumber: employee.telephoneNumber,
          emailAddress: employee.emailAddress,
          managerId: employee.managerId,
          status: employee.status ? 'active' : 'inactive', // Convert boolean to dropdown value
        });
      }
    }
  }, [data, id]);

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
      if (!formData[key as keyof typeof formData] && key !== 'status') {
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
      await updateEmployee.mutateAsync({
        id: id as string,
        ...formData,
        status: formData.status === 'active', // Convert dropdown value to boolean
      });
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading employee data.</p>;

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Edit Employee</h1>
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                {key === 'status' ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="border border-gray-300 p-2 rounded-md w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <input
                    type={key === 'emailAddress' ? 'email' : 'text'}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                )}
                {(errors as any)[key] && <p className="text-red-500 text-sm mt-1">{(errors as any)[key]}</p>}
              </div>
            ))}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => router.push('/employees')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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

export default EditEmployee;
