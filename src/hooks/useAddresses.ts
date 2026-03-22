import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AddressInput {
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default?: boolean;
}

export interface Address extends AddressInput {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const db = supabase as any;

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getCurrentUserId = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await db.auth.getUser();

    if (error) {
      return null;
    }

    return user?.id || null;
  }, []);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);

    const userId = await getCurrentUserId();
    if (!userId) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    const { data, error } = await db
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load addresses',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setAddresses((data || []) as Address[]);
    setLoading(false);
  }, [getCurrentUserId, toast]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = useCallback(
    async (payload: AddressInput) => {
      const userId = await getCurrentUserId();
      if (!userId) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to save delivery addresses',
          variant: 'destructive',
        });
        return null;
      }

      const trimmed = {
        ...payload,
        full_name: payload.full_name.trim(),
        phone_number: payload.phone_number.trim(),
        address_line1: payload.address_line1.trim(),
        address_line2: payload.address_line2?.trim() || null,
        city: payload.city.trim(),
        state: payload.state.trim(),
        pincode: payload.pincode.trim(),
        country: payload.country.trim(),
      };

      if (trimmed.is_default) {
        await db
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
          .eq('is_default', true);
      }

      const { data, error } = await db
        .from('addresses')
        .insert({ ...trimmed, user_id: userId })
        .select('*')
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to add address',
          variant: 'destructive',
        });
        return null;
      }

      setAddresses((prev) => [data as Address, ...prev.filter((a) => !(trimmed.is_default && a.is_default))]);
      return data as Address;
    },
    [getCurrentUserId, toast]
  );

  const updateAddress = useCallback(
    async (id: string, payload: Partial<AddressInput>) => {
      const userId = await getCurrentUserId();
      if (!userId) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to update delivery addresses',
          variant: 'destructive',
        });
        return null;
      }

      const nextPayload = {
        ...payload,
        full_name: payload.full_name?.trim(),
        phone_number: payload.phone_number?.trim(),
        address_line1: payload.address_line1?.trim(),
        address_line2: payload.address_line2?.trim() || null,
        city: payload.city?.trim(),
        state: payload.state?.trim(),
        pincode: payload.pincode?.trim(),
        country: payload.country?.trim(),
      };

      if (nextPayload.is_default) {
        await db
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
          .neq('id', id)
          .eq('is_default', true);
      }

      const { data, error } = await db
        .from('addresses')
        .update(nextPayload)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update address',
          variant: 'destructive',
        });
        return null;
      }

      setAddresses((prev) =>
        prev
          .map((item) => (item.id === id ? (data as Address) : nextPayload.is_default ? { ...item, is_default: false } : item))
          .sort((a, b) => Number(b.is_default) - Number(a.is_default))
      );
      return data as Address;
    },
    [getCurrentUserId, toast]
  );

  const deleteAddress = useCallback(
    async (id: string) => {
      const userId = await getCurrentUserId();
      if (!userId) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to delete delivery addresses',
          variant: 'destructive',
        });
        return false;
      }

      const current = addresses.find((a) => a.id === id);

      const { error } = await db.from('addresses').delete().eq('id', id).eq('user_id', userId);
      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete address',
          variant: 'destructive',
        });
        return false;
      }

      const remaining = addresses.filter((a) => a.id !== id);
      if (current?.is_default && remaining.length > 0) {
        const fallback = remaining[0];
        await db
          .from('addresses')
          .update({ is_default: true })
          .eq('id', fallback.id)
          .eq('user_id', userId);
        fallback.is_default = true;
      }

      setAddresses([...remaining]);
      return true;
    },
    [addresses, getCurrentUserId, toast]
  );

  return {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  };
}
