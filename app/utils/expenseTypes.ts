import { ExpenseType } from '../components/expenseform';
import { supabase } from './supabase';

/**
 * Fetches expense types from the database
 */
export const fetchExpenseTypes = async (): Promise<ExpenseType[]> => {
  try {
    const { data, error } = await supabase
      .from('expense_types')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching expense types from database:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('No expense types found in database');
      return [];
    }

    // Transform database data to match ExpenseType interface
    return data.map((type: any) => ({
      id: type.id,
      name: type.name,
      icon: type.icon,
      color: type.color,
      description: type.description
    }));
  } catch (error) {
    console.error('Error in fetchExpenseTypes:', error);
    return [];
  }
};

/**
 * Gets expense type by ID from the database
 */
export const getExpenseTypeById = async (typeId: string): Promise<ExpenseType | null> => {
  const types = await fetchExpenseTypes();
  return types.find(type => type.id === typeId) || null;
};
