# Migrate Gallery Images to Database

## Tasks
- [ ] Create Supabase storage bucket for artworks
- [ ] Create script to upload images to storage
- [ ] Create migration script to insert artworks data into database
- [ ] Update app to use database instead of static data
- [ ] Test the migration

## Current State
- Artworks table exists in database with image_url column
- Images are in public/gallery/ directory
- App uses static data from src/data/artworks.ts
- useArtworks hook is set up but not fully used

## Next Steps
1. Create storage bucket
2. Upload images to storage
3. Migrate data to database
4. Update app components
