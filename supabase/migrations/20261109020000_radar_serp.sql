-- =============================================================================
-- RADAR SEO ĐỢT 1: TỪ KHÓA → TOP GOOGLE → CÀO BÀI
--  seo_keywords   : từ khóa mình cạnh tranh (bước 1)
--  serp_snapshots : mỗi lần quét = 1 bản chụp top 10 Google của 1 từ khóa (bước 2)
--  serp_pages     : nội dung bài đối thủ đang top đã cào (bước 3)
--  radar_runs     : nhật ký mỗi ca chạy + số lượt Serper đã dùng
-- Lưu ý: các bảng competitors / competitor_scanned_pages / radar_activity_logs trong
-- supabase_schema.sql CHƯA từng được tạo trên DB, nên đợt 1 dùng bảng riêng ở đây.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  cluster_id TEXT,
  is_tracked BOOLEAN NOT NULL DEFAULT TRUE,
  our_position INTEGER,          -- vị trí website mình ở lần quét gần nhất (NULL = ngoài top 10)
  top_competitor TEXT,           -- tên miền đối thủ đứng đầu ở lần quét gần nhất
  last_scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS seo_keywords_keyword_idx ON public.seo_keywords (lower(keyword));

CREATE TABLE IF NOT EXISTS public.serp_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL REFERENCES public.seo_keywords(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- [{position, title, link, domain, snippet, kind}]
  -- kind: competitor | own | social | news | marketplace | gov | video | other
  results JSONB NOT NULL DEFAULT '[]',
  our_position INTEGER,
  people_also_ask JSONB NOT NULL DEFAULT '[]',
  related_searches JSONB NOT NULL DEFAULT '[]',
  credits_used INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS serp_snapshots_keyword_idx ON public.serp_snapshots (keyword_id, scanned_at DESC);

CREATE TABLE IF NOT EXISTS public.serp_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  title TEXT,
  headings JSONB NOT NULL DEFAULT '[]',   -- danh sách H2/H3
  clean_text TEXT,
  word_count INTEGER NOT NULL DEFAULT 0,
  scrape_error TEXT,                      -- có giá trị = không đọc được (không đưa lại vào hàng chờ)
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS serp_pages_domain_idx ON public.serp_pages (domain);

CREATE TABLE IF NOT EXISTS public.radar_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('serp-dry', 'serp-live', 'scrape')),
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'warning', 'error')),
  credits INTEGER NOT NULL DEFAULT 0,      -- lượt Serper đã dùng
  keywords_count INTEGER NOT NULL DEFAULT 0,
  pages_count INTEGER NOT NULL DEFAULT 0,
  message TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  actor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS radar_runs_created_idx ON public.radar_runs (created_at DESC);

ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serp_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serp_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radar_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage seo keywords" ON public.seo_keywords;
CREATE POLICY "Admin can manage seo keywords"
  ON public.seo_keywords FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin can manage serp snapshots" ON public.serp_snapshots;
CREATE POLICY "Admin can manage serp snapshots"
  ON public.serp_snapshots FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin can manage serp pages" ON public.serp_pages;
CREATE POLICY "Admin can manage serp pages"
  ON public.serp_pages FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin can manage radar runs" ON public.radar_runs;
CREATE POLICY "Admin can manage radar runs"
  ON public.radar_runs FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
