import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const db = supabase as any;

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  artwork_id: string;
  quantity: number;
  price: number;
  total_price: number;
  artwork_snapshot: {
    title?: string;
    image_url?: string;
    medium?: string;
    size?: string;
    year?: string;
    price?: number;
  };
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_price: number;
  subtotal_price: number;
  shipping_fee: number;
  order_status: OrderStatus;
  payment_status: string;
  payment_reference: string | null;
  shipping_address: Record<string, string>;
  shipment_provider: string | null;
  shipment_tracking_id: string | null;
  shipment_tracking_url: string | null;
  created_at: string;
  order_items?: OrderItem[];
  profiles?: {
    email?: string;
    display_name?: string | null;
  };
}

export interface TrackingEvent {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getOrderHistory = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load order history',
        variant: 'destructive',
      });
      return [] as Order[];
    }

    return (data || []) as Order[];
  }, [toast]);

  const getOrderById = useCallback(
    async (orderId: string) => {
      setLoading(true);
      const { data, error } = await db
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();
      setLoading(false);

      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load order',
          variant: 'destructive',
        });
        return null;
      }

      return data as Order;
    },
    [toast]
  );

  const getTracking = useCallback(
    async (orderId: string) => {
      const { data, error } = await db
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load tracking',
          variant: 'destructive',
        });
        return [] as TrackingEvent[];
      }

      return (data || []) as TrackingEvent[];
    },
    [toast]
  );

  const placeOrder = useCallback(
    async (payload: {
      addressId: string;
      paymentMethod: string;
      paymentReference: string | null;
      notes?: string | null;
    }) => {
      const { data, error } = await db.rpc('place_order', {
        p_address_id: payload.addressId,
        p_payment_method: payload.paymentMethod,
        p_payment_reference: payload.paymentReference,
        p_notes: payload.notes || null,
      });

      if (error) {
        toast({
          title: 'Order Failed',
          description: error.message || 'Unable to place order',
          variant: 'destructive',
        });
        return null;
      }

      return data as Order;
    },
    [toast]
  );

  const getAllOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load admin orders',
        variant: 'destructive',
      });
      return [] as Order[];
    }

    const orders = ((data || []) as Order[]);
    const userIds = Array.from(new Set(orders.map((order) => order.user_id).filter(Boolean)));

    if (userIds.length === 0) {
      setLoading(false);
      return orders;
    }

    const { data: profilesData, error: profilesError } = await db
      .from('profiles')
      .select('id, display_name, email')
      .in('id', userIds);

    if (profilesError) {
      setLoading(false);
      toast({
        title: 'Warning',
        description: profilesError.message || 'Loaded orders but failed to load customer profiles',
        variant: 'destructive',
      });
      return orders;
    }

    const profileMap = new Map<string, { display_name?: string | null; email?: string }>();
    (profilesData || []).forEach((profile: { id: string; display_name?: string | null; email?: string }) => {
      profileMap.set(profile.id, {
        display_name: profile.display_name ?? null,
        email: profile.email,
      });
    });

    setLoading(false);
    return orders.map((order) => ({
      ...order,
      profiles: profileMap.get(order.user_id),
    }));
  }, [toast]);

  const adminUpdateOrderStatus = useCallback(
    async (payload: {
      orderId: string;
      status: OrderStatus;
      note?: string;
      shipmentProvider?: string;
      shipmentTrackingId?: string;
      shipmentTrackingUrl?: string;
    }) => {
      const { data, error } = await db.rpc('admin_update_order_status', {
        p_order_id: payload.orderId,
        p_status: payload.status,
        p_note: payload.note || null,
        p_shipment_provider: payload.shipmentProvider || null,
        p_shipment_tracking_id: payload.shipmentTrackingId || null,
        p_shipment_tracking_url: payload.shipmentTrackingUrl || null,
      });

      if (error) {
        toast({
          title: 'Update Failed',
          description: error.message || 'Could not update order status',
          variant: 'destructive',
        });
        return null;
      }

      toast({
        title: 'Order Updated',
        description: 'Order status has been updated',
      });
      return data as Order;
    },
    [toast]
  );

  return {
    loading,
    getOrderHistory,
    getOrderById,
    getTracking,
    placeOrder,
    getAllOrders,
    adminUpdateOrderStatus,
  };
}
