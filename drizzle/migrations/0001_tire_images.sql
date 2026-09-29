alter table public.tires add column image_url text;
create policy "Admins upload tire images" on storage.objects for insert to authenticated with check (bucket_id = 'tire-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update tire images" on storage.objects for update to authenticated using (bucket_id = 'tire-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete tire images" on storage.objects for delete to authenticated using (bucket_id = 'tire-images' and public.has_role(auth.uid(), 'admin'));