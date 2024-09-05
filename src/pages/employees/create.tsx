import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the Zod schema for validation
const employeeSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  telephoneNumber: z.string().min(10, 'Telephone Number must be at least 10 digits'),
  emailAddress: z.string().email('Invalid email address'),
  managerId: z.string().optional(), // Manager ID is now optional
  status: z.enum(['active', 'inactive']),
});

// Infer the form data type from the schema
type EmployeeFormData = z.infer<typeof employeeSchema>;

// Create employee component
const CreateEmployee: NextPage = () => {
  const router = useRouter();

  // Initialize the form using React Hook Form and Zod resolver
  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      telephoneNumber: '',
      emailAddress: '',
      managerId: '', // Optional field
      status: 'active',
    },
  });

  const createEmployee = trpc.employee.create.useMutation({
    onSuccess: () => {
      router.push('/employees'); // Redirect to employee list page on success
    },
    onError: (error) => {
      console.error('Error creating employee:', error);
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await createEmployee.mutateAsync({
        ...data,
        managerId: data.managerId || undefined, // Ensure managerId is handled as undefined if not provided
        status: data.status === 'active',
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
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-semibold mb-1">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              {...register('firstName')}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.firstName && <p className="text-red-500 text-sm col-span-3">{errors.firstName.message}</p>}

            <label className="text-sm font-semibold mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              {...register('lastName')}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.lastName && <p className="text-red-500 text-sm col-span-3">{errors.lastName.message}</p>}

            <label className="text-sm font-semibold mb-1">Telephone Number</label>
            <input
              type="text"
              placeholder="Telephone Number"
              {...register('telephoneNumber')}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.telephoneNumber && <p className="text-red-500 text-sm col-span-3">{errors.telephoneNumber.message}</p>}

            <label className="text-sm font-semibold mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              {...register('emailAddress')}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.emailAddress && <p className="text-red-500 text-sm col-span-3">{errors.emailAddress.message}</p>}

            <label className="text-sm font-semibold mb-1">Manager ID</label>
            <input
              type="text"
              placeholder="Manager ID"
              {...register('managerId')}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            />
            {errors.managerId && <p className="text-red-500 text-sm col-span-3">{errors.managerId.message}</p>}

            <label className="text-sm font-semibold mb-1">Status</label>
            <select
              {...register('status')}
              className="border border-gray-300 p-2 rounded-md w-full col-span-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm col-span-3">{errors.status.message}</p>}

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
