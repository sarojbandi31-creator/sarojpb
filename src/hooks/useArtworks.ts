import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Artwork {
  id: string;
  title: string;
  medium: string;
  size: string;
  year: number;
  description: string;
  image_url: string;
  featured?: boolean;
  price: number;
  artist: string;
  artist_location: string;
  sold?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchArtworks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load artworks',
        variant: 'destructive',
      });
    } else {
      setArtworks(data || []);
    }
    setLoading(false);
  };

  const createArtwork = async (artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('artworks')
      .insert([artwork])
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create artwork',
        variant: 'destructive',
      });
      return null;
    }

    setArtworks(prev => [data, ...prev]);
    toast({
      title: 'Success',
      description: 'Artwork created successfully',
    });
    return data;
  };

  const updateArtwork = async (id: string, updates: Partial<Artwork>) => {
    const { data, error } = await supabase
      .from('artworks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update artwork',
        variant: 'destructive',
      });
      return null;
    }

    setArtworks(prev => prev.map(artwork =>
      artwork.id === id ? data : artwork
    ));
    toast({
      title: 'Success',
      description: 'Artwork updated successfully',
    });
    return data;
  };

  const deleteArtwork = async (id: string) => {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete artwork',
        variant: 'destructive',
      });
      return false;
    }

    setArtworks(prev => prev.filter(artwork => artwork.id !== id));
    toast({
      title: 'Success',
      description: 'Artwork deleted successfully',
    });
    return true;
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  return {
    artworks,
    loading,
    fetchArtworks,
    createArtwork,
    updateArtwork,
    deleteArtwork,
  };
}
