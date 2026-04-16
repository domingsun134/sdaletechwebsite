-- =============================================================
-- HR Lookups table
-- Stores reference data for Nationality, IdentityType, and Race
-- used by the onboarding form and Desktop RPA / Power Automate.
-- Follows the same item / item_full_name / ad_full_name pattern
-- as the existing companies, locations, regions, departments tables.
-- =============================================================

CREATE TABLE IF NOT EXISTS hr_lookups (
    id             BIGSERIAL    PRIMARY KEY,
    type           TEXT         NOT NULL,           -- 'Nationality' | 'IdentityType' | 'Race'
    item           TEXT         NOT NULL,           -- value stored in form & sent to RPA
    item_full_name TEXT         NOT NULL DEFAULT '', -- human-readable full name
    ad_full_name   TEXT,                            -- downstream HR / AD system full name
    sort_order     INT          NOT NULL DEFAULT 999,
    is_active      BOOLEAN      NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT hr_lookups_type_item_unique UNIQUE (type, item)
);

-- Fast filtered lookups (dropdown population)
CREATE INDEX IF NOT EXISTS idx_hr_lookups_type_active
    ON hr_lookups (type, is_active, sort_order);

-- RLS: public read (onboarding form is public-facing); writes restricted to authenticated users
ALTER TABLE hr_lookups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hr_lookups_read_all"
    ON hr_lookups FOR SELECT USING (true);

CREATE POLICY "hr_lookups_write_authenticated"
    ON hr_lookups FOR ALL USING (auth.role() = 'authenticated');


-- =============================================================
-- NATIONALITY
-- Covers all countries where Sunningdale Tech has operations.
-- item values must match NATIONALITY_OPTIONS in
-- CandidateOnboarding.jsx (what the form stores / RPA receives).
-- =============================================================
INSERT INTO hr_lookups (type, item, item_full_name, sort_order) VALUES
    -- ── Standard nationalities ────────────────────────────────
    ('Nationality', 'Bangladeshi / 孟加拉国',                   'BD - Bangladeshi',         1),
    ('Nationality', 'Chinese / 中国',                           'PRC - Chinese',            2),
    ('Nationality', 'Filipino / 菲律宾',                        'FIL - Filipino',           3),
    ('Nationality', 'German / 德国',                            'DE - German',              4),
    ('Nationality', 'Indian / 印度',                            'IN - Indian',              5),
    ('Nationality', 'Indonesian / 印度尼西亚',                  'IDN - Indonesian',         6),
    ('Nationality', 'Korean / 韩国',                            'KR - Korean',              7),
    ('Nationality', 'Latvian / 拉脱维亚',                       'LV - Latvian',             8),
    ('Nationality', 'Malaysian / 马来西亚',                     'MY - Malaysian',           9),
    ('Nationality', 'Mexican / 墨西哥',                         'MX - Mexican',             10),
    ('Nationality', 'Myanmar / 缅甸',                           'MYA - Myanmar',            11),
    ('Nationality', 'Pakistani / 巴基斯坦',                     'PK - Pakistani',           12),
    ('Nationality', 'Singaporean / 新加坡',                     'SG - Singaporean',         13),
    ('Nationality', 'Sri Lankan / 斯里兰卡',                    'LK - Sri Lankan',          14),
    ('Nationality', 'Thai / 泰国',                              'TH - Thai',                15),
    ('Nationality', 'Vietnamese / 越南',                        'VN - Vietnamese',          16),
    ('Nationality', 'Others / 其他',                            'OTH - Others',             17),
    -- ── Singapore PR (SPR) variants ──────────────────────────
    ('Nationality', 'SPR Chinese / 新加坡永久居民中国',          'SPRPRC - SPR Chinese',     20),
    ('Nationality', 'SPR Filipino / 新加坡永久居民菲律宾',       'SPRFIL - SPR Filipino',    21),
    ('Nationality', 'SPR Indian / 新加坡永久居民印度',           'SPRIN - SPR Indian',       22),
    ('Nationality', 'SPR Indonesian / 新加坡永久居民印度尼西亚', 'SPRIDN - SPR Indonesian',  23),
    ('Nationality', 'SPR Malaysian / 新加坡永久居民马来西亚',    'SPRMY - SPR Malaysian',    24),
    ('Nationality', 'SPR Myanmar / 新加坡永久居民缅甸',          'SPRMYA - SPR Myanmar',     25),
    ('Nationality', 'SPR Others / 新加坡永久居民其他',           'SPROTH - SPR Others',      26)
ON CONFLICT (type, item) DO NOTHING;


-- =============================================================
-- IDENTITY TYPE
-- Singapore standard types (auto-detected by server from ID prefix),
-- Malaysia, China (CN01–CN06), Indonesia, and India types.
-- =============================================================
INSERT INTO hr_lookups (type, item, item_full_name, sort_order) VALUES
    -- ── Singapore ─────────────────────────────────────────────
    ('IdentityType', 'NRIC',                      'NRIC - National Registration Identity Card',  1),
    ('IdentityType', 'FIN',                       'FIN - Foreign Identification Number',         2),
    ('IdentityType', 'Passport',                  'Passport',                                    3),
    ('IdentityType', 'Employment Pass',           'EP - Employment Pass',                        4),
    ('IdentityType', 'S Pass',                    'SP - S Pass',                                 5),
    ('IdentityType', 'Work Permit (SG)',           'WP - Work Permit Singapore',                  6),
    ('IdentityType', 'Dependent Pass',            'DP - Dependent Pass',                         7),
    ('IdentityType', 'Long Term Visit Pass',      'LTVP - Long Term Visit Pass',                 8),
    -- ── Malaysia ──────────────────────────────────────────────
    ('IdentityType', 'MyKad',                     'MY01 - MyKad (Malaysian Citizen)',             10),
    ('IdentityType', 'MyPR',                      'MY02 - MyPR (Malaysia Permanent Resident)',    11),
    ('IdentityType', 'MyKid',                     'MY03 - MyKid (Malaysian Child)',               12),
    -- ── China (CN01–CN06) ─────────────────────────────────────
    ('IdentityType', 'Citizen IC',                                               'CN01 - Citizen IC',                                                4),
    ('IdentityType', 'Mainland Travel Permit for Hong Kong and Macau Residents', 'CN02 - Mainland Travel Permit for Hong Kong and Macau Residents',   5),
    ('IdentityType', 'Residence Permit',                                         'CN03 - Residence Permit',                                          6),
    ('IdentityType', 'Temporary Residence Permit',                               'CN04 - Temporary Residence Permit',                                7),
    ('IdentityType', 'Work Permit (CN)',                                         'CN05 - Work Permit China',                                         8),
    ('IdentityType', 'Residence Permit For Foreigner',                           'CN06 - Residence Permit For Foreigner',                            9),
    -- ── Indonesia ─────────────────────────────────────────────
    ('IdentityType', 'KTP',                       'ID01 - KTP (Kartu Tanda Penduduk)',            20),
    ('IdentityType', 'KITAS',                     'ID02 - KITAS (Temporary Stay Permit)',         21),
    ('IdentityType', 'KITAP',                     'ID03 - KITAP (Permanent Stay Permit)',         22),
    -- ── India ─────────────────────────────────────────────────
    ('IdentityType', 'Aadhaar Card',              'IN01 - Aadhaar Card',                          30)
ON CONFLICT (type, item) DO NOTHING;


-- =============================================================
-- RACE
-- Core SG races + comprehensive Southeast Asian ethnic groups
-- + Indonesian subgroups + Chinese 56 ethnic groups (CN-*)
-- + South Asian subgroups.
-- =============================================================
INSERT INTO hr_lookups (type, item, item_full_name, sort_order) VALUES
    -- ── Core Singapore races ──────────────────────────────────
    ('Race', 'Chinese / 华',                'C - Chinese',              1),
    ('Race', 'Eurasian',                    'EA - Eurasian',            2),
    ('Race', 'Indian / 印度',               'IN - Indian',              3),
    ('Race', 'Malay / 马来',                'M - Malay',                4),
    ('Race', 'Others / 其他',               'O - Others',               5),
    -- ── General international ─────────────────────────────────
    ('Race', 'Arab',                        'AR - Arab',                10),
    ('Race', 'Bengali',                     'BG - Bengali',             11),
    ('Race', 'Borneoese',                   'BP - Borneoese',           12),
    ('Race', 'Burmese',                     'BU - Burmese',             13),
    ('Race', 'Caucasian',                   'CAU - Caucasian',          14),
    ('Race', 'Deutsch',                     'DT - Deutsch',             15),
    ('Race', 'Filipino / 菲律宾',           'F - Filipino',             16),
    ('Race', 'Iban',                        'IB - Iban',                17),
    ('Race', 'Kadazan',                     'KD - Kadazan',             18),
    ('Race', 'Korean',                      'KR - Korean',              19),
    ('Race', 'Myanmar / 缅甸',              'MY - Myanmar',             20),
    ('Race', 'Palestinian',                 'PAL - Palestinian',        21),
    ('Race', 'Sinhalese',                   'SN - Sinhalese',           22),
    ('Race', 'Tamil',                       'TM - Tamil',               23),
    ('Race', 'Vietnamese',                  'VN - Vietnamese',          24),
    -- ── Indian subgroups ─────────────────────────────────────
    ('Race', 'Indian-Bengali',              'IN-BN - Indian Bengali',   30),
    ('Race', 'Indian-Gujarati',             'IN-GJ - Indian Gujarati',  31),
    ('Race', 'Indian-Kannada',              'IN-KN - Indian Kannada',   32),
    ('Race', 'Indian-Malayalam',            'IN-ML - Indian Malayalam', 33),
    ('Race', 'Indian-Marathi',              'IN-MH - Indian Marathi',   34),
    ('Race', 'Indian-Punjabi',              'IN-PB - Indian Punjabi',   35),
    ('Race', 'Indian-Sikh',                 'IN-SK - Indian Sikh',      36),
    ('Race', 'Indian-Sindhi',               'IN-SD - Indian Sindhi',    37),
    ('Race', 'Indian-Tamil',                'IN-TM - Indian Tamil',     38),
    ('Race', 'Indian-Telugu',               'IN-TL - Indian Telugu',    39),
    ('Race', 'Indian-Others',               'IN-OT - Indian Others',    40),
    -- ── Indonesian ethnic subgroups ──────────────────────────
    ('Race', 'Acehnese',                    'ACH - Acehnese',           50),
    ('Race', 'Ambonese',                    'AMB - Ambonese',           51),
    ('Race', 'Balinese',                    'BAL - Balinese',           52),
    ('Race', 'Banjarese',                   'BNJ - Banjarese',          53),
    ('Race', 'Batak-Angkola',               'BT-AK - Batak Angkola',    54),
    ('Race', 'Batak-Karo',                  'BT-KR - Batak Karo',       55),
    ('Race', 'Batak-Mandailing',            'BT-MD - Batak Mandailing', 56),
    ('Race', 'Batak-Pakpak',                'BT-PK - Batak Pakpak',     57),
    ('Race', 'Batak-Simalungun',            'BT-SM - Batak Simalungun', 58),
    ('Race', 'Batak-Toba',                  'BT-TB - Batak Toba',       59),
    ('Race', 'Betawi',                      'BTW - Betawi',             60),
    ('Race', 'Buginese',                    'BGS - Buginese',           61),
    ('Race', 'Dayak',                       'DYK - Dayak',              62),
    ('Race', 'Flores',                      'FL - Flores',              63),
    ('Race', 'Gorontalo',                   'GRT - Gorontalo',          64),
    ('Race', 'Indonesian',                  'IDN - Indonesian',         65),
    ('Race', 'Javanese',                    'JV - Javanese',            66),
    ('Race', 'Lampung',                     'LP - Lampung',             67),
    ('Race', 'Madurese',                    'MDR - Madurese',           68),
    ('Race', 'Minahasa',                    'MNH - Minahasa',           69),
    ('Race', 'Minangkabau',                 'MNK - Minangkabau',        70),
    ('Race', 'Padang',                      'PD - Padang',              71),
    ('Race', 'Sasak',                       'SSK - Sasak',              72),
    ('Race', 'Sunda',                       'SU - Sunda',               73),
    ('Race', 'Toraja',                      'TRJ - Toraja',             74),
    -- ── Chinese ethnic groups (CN-*) — 56 official groups ────
    ('Race', 'CN-Han',                      'CN001 - CN - Han',         100),
    ('Race', 'CN-Zhuang',                   'CN002 - CN - Zhuang',      101),
    ('Race', 'CN-Hui',                      'CN003 - CN - Hui',         102),
    ('Race', 'CN-Man',                      'CN004 - CN - Man',         103),
    ('Race', 'CN-WeiwuEr',                  'CN005 - CN - WeiwuEr',     104),
    ('Race', 'CN-Miao',                     'CN006 - CN - Miao',        105),
    ('Race', 'CN-Yi',                       'CN007 - CN - Yi',          106),
    ('Race', 'CN-Tuyh',                     'CN008 - CN - Tuyh',        107),
    ('Race', 'CN-Zang',                     'CN009 - CN - Zang',        108),
    ('Race', 'CN-Menggu',                   'CN010 - CN - Menggu',      109),
    ('Race', 'CN-Dong',                     'CN011 - CN - Dong',        110),
    ('Race', 'CN-BuYi',                     'CN012 - CN - BuYi',        111),
    ('Race', 'CN-Dao',                      'CN013 - CN - Dao',         112),
    ('Race', 'CN-Bai',                      'CN014 - CN - Bai',         113),
    ('Race', 'CN-ChaXian',                  'CN015 - CN - ChaXian',     114),
    ('Race', 'CN-Hani',                     'CN016 - CN - Hani',        115),
    ('Race', 'CN-KaZake',                   'CN017 - CN - KaZake',      116),
    ('Race', 'CN-Li',                       'CN018 - CN - Li',          117),
    ('Race', 'CN-Dai',                      'CN019 - CN - Dai',         118),
    ('Race', 'CN-She',                      'CN020 - CN - She',         119),
    ('Race', 'CN-Lisu',                     'CN021 - CN - Lisu',        120),
    ('Race', 'CN-Gelao',                    'CN022 - CN - Gelao',       121),
    ('Race', 'CN-Lahu',                     'CN023 - CN - Lahu',        122),
    ('Race', 'CN-Wa',                       'CN024 - CN - Wa',          123),
    ('Race', 'CN-Sui',                      'CN025 - CN - Sui',         124),
    ('Race', 'CN-NaXi',                     'CN026 - CN - NaXi',        125),
    ('Race', 'CN-Qiang',                    'CN027 - CN - Qiang',       126),
    ('Race', 'CN-Tu',                       'CN028 - CN - Tu',          127),
    ('Race', 'CN-XiBo',                     'CN029 - CN - XiBo',        128),
    ('Race', 'CN-Muan',                     'CN030 - CN - Muan',        129),
    ('Race', 'CN-KeEr',                     'CN031 - CN - KeEr',        130),
    ('Race', 'CN-Tugur',                    'CN032 - CN - Tugur',       131),
    ('Race', 'CN-JingPo',                   'CN033 - CN - JingPo',      132),
    ('Race', 'CN-Mao',                      'CN034 - CN - Mao',         133),
    ('Race', 'CN-Salar',                    'CN035 - CN - Salar',       134),
    ('Race', 'CN-BuLang',                   'CN036 - CN - BuLang',      135),
    ('Race', 'CN-Tajike',                   'CN037 - CN - Tajike',      136),
    ('Race', 'CN-AnChang',                  'CN038 - CN - AnChang',     137),
    ('Race', 'CN-PuMi',                     'CN039 - CN - PuMi',        138),
    ('Race', 'CN-EWenKe',                   'CN040 - CN - EWenKe',      139),
    ('Race', 'CN-Nu',                       'CN041 - CN - Nu',          140),
    ('Race', 'CN-Jing',                     'CN042 - CN - Jing',        141),
    ('Race', 'CN-Jino',                     'CN043 - CN - Jino',        142),
    ('Race', 'CN-DeAng',                    'CN044 - CN - DeAng',       143),
    ('Race', 'CN-BaoAn',                    'CN045 - CN - BaoAn',       144),
    ('Race', 'CN-E',                        'CN046 - CN - E',           145),
    ('Race', 'CN-YuGu',                     'CN047 - CN - YuGu',        146),
    ('Race', 'CN-WuZiBo',                   'CN048 - CN - WuZiBo',      147),
    ('Race', 'CN-MenBa',                    'CN049 - CN - MenBa',       148),
    ('Race', 'CN-ELunChun',                 'CN050 - CN - ELunChun',    149),
    ('Race', 'CN-DuLong',                   'CN051 - CN - DuLong',      150),
    ('Race', 'CN-Talar',                    'CN052 - CN - Talar',       151),
    ('Race', 'CN-HaZhe',                    'CN053 - CN - HaZhe',       152),
    ('Race', 'CN-GaoShan',                  'CN054 - CN - GaoShan',     153),
    ('Race', 'CN-LuoBa',                    'CN055 - CN - LuoBa',       154),
    -- Additional CN- codes visible in HR system (legacy / internal)
    ('Race', 'CN-OnLao',                    'CN101 - CN - OnLao',       160),
    ('Race', 'CN-Hao',                      'CN102 - CN - Hao',         161),
    ('Race', 'CN-RenJia',                   'CN103 - CN - RenJia',      162),
    ('Race', 'CN-WenHuaC',                  'CN104 - CN - WenHuaC',     163),
    ('Race', 'CN-ShaZa',                    'CN105 - CN - ShaZa',       164),
    ('Race', 'CN-Wu',                       'CN106 - CN - Wu',          165),
    ('Race', 'CN-GanYan',                   'CN107 - CN - GanYan',      166),
    ('Race', 'CN-GanShan',                  'CN108 - CN - GanShan',     167),
    ('Race', 'CN-HuaMan',                   'CN109 - CN - HuaMan',      168),
    ('Race', 'CN-Roshan',                   'CN110 - CN - Roshan',      169),
    ('Race', 'CN-Doung',                    'CN111 - CN - Doung',       170),
    ('Race', 'CN-Rounto',                   'CN112 - CN - Rounto',      171),
    ('Race', 'CN-OutLang',                  'CN113 - CN - OutLang',     172),
    ('Race', 'CN-Biao',                     'CN114 - CN - Biao',        173),
    ('Race', 'CN-Unteel',                   'CN115 - CN - Unteel',      174),
    ('Race', 'CN-Others',                   'CN199 - CN - Others',      175)
ON CONFLICT (type, item) DO NOTHING;
