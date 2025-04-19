/* eslint-disable */

// It is used to fetch unemployment rates for a given county and state.
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime  = 'nodejs';
export const dynamic  = 'force-dynamic';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;
const BLS_API_KEY  = process.env.BLS_API_KEY ?? '';
const BLS_API_BASE = process.env.BLS_API_BASE_URL ?? 'https://api.bls.gov/publicAPI/';

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─────────────────────────────────────────────────────────
//   snake‑cased   ↓↓↓
const MEASURE_CODES: Record<string, string> = {
  unemployment_rate:                 '03',
  unemployment:                      '04',
  employment:                        '05',
  labor_force:                       '06',
  employment_population_ratio:       '07',
  labor_force_participation_rate:    '08',
  civilian_noninstitutional_population: '09',
};
// ─────────────────────────────────────────────────────────


async function getFullFips(county: string, state: string): Promise<string | null> {
      const { data } = await sb
        .from('Catwalk_2023_dups')
        .select('fips_code')
        .ilike('county', `%${county}%`)
        .ilike('state', state)
        .limit(1)
        .single();
      return data?.fips_code ?? null;
}

const buildSeriesId = (fips: string, mc: string) => `LAUCN${fips}00000000${mc}`;

const extractValues = (series: any) =>
  series.data.map((d: any) => ({
    year:  d.year,
    month: d.period.slice(1),               // drop "M"
    value: Number(d.value),
    preliminary: (d.footnotes ?? []).some((f: any) => f.code === 'P'),
  }));

export async function POST(req: Request) {
  try {
    const { county, state, queryType = 'unemployment_rate' } = await req.json();
    console.log(county, state, queryType);
    console.log(req);
    if (!county || !state)
      return NextResponse.json({ error: 'county and state are required' }, { status: 400 });

    // normalise input → snake_case
    const key = String(queryType).toLowerCase().replace(/\s+/g, '_');
    const measureCode = MEASURE_CODES[key];
    if (!measureCode)
      return NextResponse.json(
        { error: `unsupported queryType. allowed: ${Object.keys(MEASURE_CODES).join(', ')}` },
        { status: 400 },
      );
    console.log(measureCode);
    const fips = await getFullFips(county, state.toUpperCase());
    if (!fips)
      return NextResponse.json({ error: `county not found: ${county}, ${state}` }, { status: 404 });

    const seriesId = buildSeriesId(fips, measureCode);

    const payload: any = {
      seriesid: [seriesId],
      startyear: '2015',
      endyear:   '2025',
      ...(BLS_API_KEY && { registrationkey: BLS_API_KEY }),
    };

    const blsRes = await fetch(`${BLS_API_BASE}timeseries/data/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:   JSON.stringify(payload),
    });

    if (!blsRes.ok)
      return NextResponse.json({ error: `BLS request failed: ${blsRes.status}` }, { status: 502 });

    const blsJson = await blsRes.json();
    if (blsJson.status !== 'REQUEST_SUCCEEDED')
      return NextResponse.json({ error: blsJson.message?.[0] ?? 'BLS error' }, { status: 502 });

    const series = blsJson.Results.series?.[0];
    if (!series?.data?.length)
      return NextResponse.json({ error: 'no BLS data found' }, { status: 404 });

    return NextResponse.json({
      county,
      state,
      seriesId,
      data: extractValues(series),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}