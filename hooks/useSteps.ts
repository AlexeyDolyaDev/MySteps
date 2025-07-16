import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Toast } from 'toastify-react-native';

export function useSteps() {
  return useQuery({
    queryKey: ['steps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('steps')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    }
  });
}

export function useSaveSteps(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stepsCount: number) => {
      const { error } = await supabase
        .from('steps')
        .insert([{ steps_count: stepsCount }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
      Toast.success('Success!', 'bottom');
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      Toast.error(`Error ${err?.message}`);
    }
  });
}
