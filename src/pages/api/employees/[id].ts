import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userRole = (session.user as any).role; // Type assertion to handle role
  const userId = (session.user as any).id; // Type assertion to handle userId

  const employeeId = Array.isArray(id) ? id[0] : id;

  if (req.method === 'GET') {
    try {
      const employee = await db.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      if (userRole === 'employee' && userId !== employee.userId) {
        return res.status(403).json({ message: 'Forbidden: You can only access your own data' });
      }

      res.status(200).json(employee);
    } catch (error) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
