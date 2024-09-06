import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc'; 
import Layout from '../../../components/Layout';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

// Define the form data type
type DepartmentFormData = {
  name: string;
  managerId: string;
  status: boolean;
};

const EditDepartment: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch department data using TRPC
  const { data: department, isLoading } = trpc.department.getOne.useQuery(
    { id: id as string },
    { enabled: !!id }
  );

  // Use react-hook-form to manage form state
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DepartmentFormData>({
    defaultValues: {
      name: '',
      managerId: '',
      status: false,
    },
  });

  // Set form values once department data is loaded
  useEffect(() => {
    if (department) {
      setValue('name', department.name);
      setValue('managerId', department.managerId ?? '');
      setValue('status', department.status ?? false);
    }
  }, [department, setValue]);

  // Update department using TRPC mutation
  const updateDepartment = trpc.department.update.useMutation({
    onSuccess: () => {
      router.push('/departments');
    },
    onError: (error) => {
      console.error('Error updating department:', error);
    },
  });

  // Rename the custom handleSubmit function to onFormSubmit
  const onFormSubmit = (formData: DepartmentFormData) => {
    // Convert the status field back to a boolean
    const updatedData = {
      ...formData,
      status: formData.status === 'true', // Convert string to boolean
    };
  
    updateDepartment.mutate({
      id: id as string,
      ...updatedData,
    });
  };

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Edit Department</h1>
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col space-y-4">
            {/* Department Name Field */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Department Name</label>
              <input
                type="text"
                {...register('name', { required: 'Department name is required' })}
                className="border border-gray-300 p-2 rounded-md"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Manager ID Field */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Manager ID</label>
              <input
                type="text"
                {...register('managerId', { required: 'Manager ID is required' })}
                className="border border-gray-300 p-2 rounded-md"
              />
              {errors.managerId && <p className="text-red-500 text-sm">{errors.managerId.message}</p>}
            </div>

            {/* Status Field */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Status</label>
              <select
                {...register('status')}
                className="border border-gray-300 p-2 rounded-md"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Submit and Cancel Buttons */}
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
                onClick={() => router.push('/departments')}
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

export default EditDepartment;
