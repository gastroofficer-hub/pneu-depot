create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users see own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_role after insert on auth.users
for each row execute function public.handle_new_user_role();

create table public.tires (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  model text not null,
  width int not null,
  profile int not null,
  diameter int not null,
  load_index text not null default '',
  speed_index text not null default '',
  season text not null default 'letni',
  price int not null default 0,
  stock int not null default 0,
  fuel text not null default 'C',
  wet text not null default 'B',
  noise int not null default 70,
  category text not null default 'osobni',
  created_at timestamptz not null default now()
);
grant select on public.tires to anon, authenticated;
grant insert, update, delete on public.tires to authenticated;
grant all on public.tires to service_role;
alter table public.tires enable row level security;
create policy "Tires public read" on public.tires for select to anon, authenticated using (true);
create policy "Admins insert tires" on public.tires for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update tires" on public.tires for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete tires" on public.tires for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.tires (slug,brand,model,width,profile,diameter,load_index,speed_index,season,price,stock,fuel,wet,noise,category) values
('michelin-pilot-sport-5-225-45-r17','Michelin','Pilot Sport 5',225,45,17,'94','Y','letni',3690,24,'B','A',71,'osobni'),
('continental-wintercontact-ts870-205-55-r16','Continental','WinterContact TS 870',205,55,16,'91','H','zimni',2490,48,'C','B',70,'osobni'),
('goodyear-vector-4seasons-gen3-195-65-r15','Goodyear','Vector 4Seasons Gen-3',195,65,15,'91','V','celorocni',2150,36,'B','B',69,'osobni'),
('bridgestone-blizzak-6-225-40-r18','Bridgestone','Blizzak 6',225,40,18,'92','V','zimni',4290,12,'C','A',72,'osobni'),
('nokian-seasonproof-suv-235-55-r18','Nokian','Seasonproof SUV',235,55,18,'104','V','celorocni',3980,18,'C','B',71,'suv'),
('pirelli-scorpion-verde-235-60-r18','Pirelli','Scorpion Verde',235,60,18,'103','W','letni',4450,9,'B','A',70,'suv'),
('barum-polaris-5-185-65-r15','Barum','Polaris 5',185,65,15,'88','T','zimni',1490,64,'D','B',71,'osobni'),
('hankook-vantra-ls-215-65-r16c','Hankook','Vantra LT',215,65,16,'109','T','letni',2890,21,'C','B',72,'dodavka'),
('dunlop-sport-maxx-rt2-245-40-r19','Dunlop','Sport Maxx RT2',245,40,19,'98','Y','letni',5190,6,'C','A',71,'osobni'),
('kleber-quadraxer-3-205-60-r16','Kleber','Quadraxer 3',205,60,16,'92','H','celorocni',2290,30,'C','B',70,'osobni'),
('michelin-agilis-crossclimate-225-65-r16c','Michelin','Agilis CrossClimate',225,65,16,'112','R','celorocni',4090,15,'B','B',72,'dodavka'),
('continental-premiumcontact-7-205-55-r16','Continental','PremiumContact 7',205,55,16,'91','V','letni',2790,42,'B','A',70,'osobni');