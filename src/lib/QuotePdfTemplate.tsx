import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { UserData } from '../types';
import type { QuoteLineItem } from './calculateQuote';

const BRAND       = '#005589';
const BRAND_DARK  = '#003d66';
const BRAND_MID   = '#1e6fa8';
const SLATE_900   = '#0f172a';
const SLATE_600   = '#475569';
const SLATE_400   = '#94a3b8';
const SLATE_100   = '#f1f5f9';
const EMERALD     = '#10b981';
const WHITE       = '#ffffff';
const LIGHT_BLUE  = '#dbeafe';


function fmt(n: number) { return '$' + n.toLocaleString('en-US'); }
function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

const s = StyleSheet.create({
  page: { backgroundColor: WHITE, paddingBottom: 50 },

  // Left accent strip
  accentBar: { position: 'absolute', left: 0, top: 0, width: 4, bottom: 0, backgroundColor: BRAND },

  // ── HEADER ──────────────────────────────────────────────────────
  header: {
    backgroundColor: BRAND_DARK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 18,
    paddingBottom: 14,
    paddingLeft: 20,
    paddingRight: 18,
  },
  logoBlock: { flexDirection: 'column' },
  logo: { width: 108, height: 33 },
  logoFallback: { fontSize: 16, color: WHITE, fontWeight: 'bold' },
  tagline: { fontSize: 8, color: '#93c5fd', marginTop: 5 },
  headerDivider: { width: 1, backgroundColor: BRAND_MID, marginHorizontal: 10, alignSelf: 'stretch' },
  metaBlock: { alignItems: 'flex-end' },
  metaChip: { fontSize: 6, color: '#7dd3fc', fontWeight: 'bold', marginBottom: 4 },
  metaRef: { fontSize: 12, color: WHITE, fontWeight: 'bold', marginBottom: 3 },
  metaLine: { fontSize: 7, color: '#bfdbfe', marginBottom: 2 },

  // ── PRICE BAND ──────────────────────────────────────────────────
  priceBand: {
    backgroundColor: BRAND,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 18,
    paddingTop: 10,
    paddingBottom: 10,
  },
  priceLabel: { fontSize: 6, color: '#7dd3fc', fontWeight: 'bold', marginBottom: 2 },
  priceValue: { fontSize: 26, color: WHITE, fontWeight: 'bold', marginBottom: 1 },
  priceSub: { fontSize: 7, color: '#93c5fd' },
  confBadge: {
    backgroundColor: '#1e3a5f',
    borderRadius: 3,
    paddingLeft: 8, paddingRight: 8,
    paddingTop: 4, paddingBottom: 4,
  },
  confText: { fontSize: 6, color: '#7dd3fc', fontWeight: 'bold' },

  // ── BODY ────────────────────────────────────────────────────────
  body: { paddingLeft: 16, paddingRight: 16, paddingTop: 14 },

  // Prepared for
  prepBox: {
    backgroundColor: LIGHT_BLUE,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: BRAND,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12, paddingRight: 12,
    paddingTop: 10, paddingBottom: 10,
    marginBottom: 14,
  },
  prepLeft: { flex: 1 },
  prepChip: { fontSize: 6, color: BRAND, fontWeight: 'bold', marginBottom: 4 },
  prepCompany: { fontSize: 12, color: SLATE_900, fontWeight: 'bold', marginBottom: 3 },
  prepContact: { fontSize: 7, color: SLATE_600 },
  assessBadge: {
    backgroundColor: EMERALD,
    borderRadius: 3,
    paddingLeft: 8, paddingRight: 8,
    paddingTop: 4, paddingBottom: 4,
  },
  assessText: { fontSize: 6, color: WHITE, fontWeight: 'bold' },

  // Section header
  secRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, marginTop: 4 },
  secTitle: { fontSize: 8, color: BRAND, fontWeight: 'bold' },
  secLine: { flex: 1, height: 0.5, backgroundColor: '#c7dce8', marginLeft: 8 },

  // ── TABLE ───────────────────────────────────────────────────────
  tableHead: {
    backgroundColor: SLATE_900,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10, paddingRight: 10,
    paddingTop: 5, paddingBottom: 5,
  },
  thSvc: { flex: 1, fontSize: 7, color: WHITE, fontWeight: 'bold' },
  thHrs: { width: 38, fontSize: 7, color: WHITE, fontWeight: 'bold', textAlign: 'right' },
  thAmt: { width: 70, fontSize: 7, color: WHITE, fontWeight: 'bold', textAlign: 'right' },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10, paddingRight: 10,
    paddingTop: 7, paddingBottom: 7,
    backgroundColor: WHITE,
  },
  tableRowAlt: { backgroundColor: SLATE_100 },

  numCircle: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: BRAND,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8,
  },
  numText: { fontSize: 7, color: WHITE, fontWeight: 'bold' },
  svcCol: { flex: 1 },
  svcName: { fontSize: 9, color: SLATE_900, fontWeight: 'bold', marginBottom: 2 },
  svcDesc: { fontSize: 6.5, color: SLATE_600 },
  hrsCol: { width: 38, alignItems: 'flex-end' },
  amtCol: { width: 70, alignItems: 'flex-end' },
  hrsText: { fontSize: 8, color: SLATE_600 },
  amtText: { fontSize: 9, color: SLATE_900, fontWeight: 'bold' },

  // Divider
  divider: { height: 0.5, backgroundColor: '#e2e8f0', marginTop: 4, marginBottom: 8 },

  // Totals
  totalsOuter: { alignItems: 'flex-end', marginBottom: 12 },
  totalsBox: {
    width: 185,
    backgroundColor: SLATE_100,
    borderRadius: 3,
    paddingLeft: 12, paddingRight: 12,
    paddingTop: 8, paddingBottom: 8,
  },
  totRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  totLabel: { fontSize: 7.5, color: SLATE_600 },
  totVal: { fontSize: 7.5, color: SLATE_600 },
  totDivider: { height: 0.5, backgroundColor: BRAND, marginTop: 2, marginBottom: 6 },
  totFinal: { flexDirection: 'row', justifyContent: 'space-between' },
  totFinalLabel: { fontSize: 11, color: BRAND, fontWeight: 'bold' },
  totFinalVal: { fontSize: 11, color: BRAND, fontWeight: 'bold' },

  // Stats bar
  statBar: {
    backgroundColor: BRAND,
    borderRadius: 3,
    flexDirection: 'row',
    marginBottom: 14,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    paddingLeft: 10, paddingRight: 10,
    paddingTop: 8, paddingBottom: 8,
    borderRightWidth: 0.5, borderRightColor: BRAND_MID,
  },
  statCellLast: {
    flex: 1,
    paddingLeft: 10, paddingRight: 10,
    paddingTop: 8, paddingBottom: 8,
  },
  statLabel: { fontSize: 6, color: '#93c5fd', fontWeight: 'bold', marginBottom: 3 },
  statValue: { fontSize: 9, color: WHITE, fontWeight: 'bold' },

  // Scope grid
  scopeRow: { flexDirection: 'row', marginBottom: 3 },
  scopeCell: {
    flex: 1,
    backgroundColor: SLATE_100,
    borderRadius: 2,
    borderLeftWidth: 2,
    borderLeftColor: BRAND,
    paddingLeft: 7, paddingRight: 4,
    paddingTop: 5, paddingBottom: 5,
    marginRight: 3,
  },
  scopeCellLast: {
    flex: 1,
    backgroundColor: SLATE_100,
    borderRadius: 2,
    borderLeftWidth: 2,
    borderLeftColor: BRAND,
    paddingLeft: 7, paddingRight: 4,
    paddingTop: 5, paddingBottom: 5,
  },
  scopeKey: { fontSize: 5.5, color: SLATE_400, fontWeight: 'bold', marginBottom: 2 },
  scopeVal: { fontSize: 8, color: SLATE_900, fontWeight: 'bold' },

  // Why DS
  whyRow: { flexDirection: 'row', marginBottom: 3 },
  whyCell: {
    flex: 1,
    backgroundColor: SLATE_100,
    borderRadius: 2,
    borderLeftWidth: 2,
    borderLeftColor: BRAND,
    paddingLeft: 9, paddingRight: 6,
    paddingTop: 7, paddingBottom: 7,
    marginRight: 4,
  },
  whyCellLast: {
    flex: 1,
    backgroundColor: SLATE_100,
    borderRadius: 2,
    borderLeftWidth: 2,
    borderLeftColor: BRAND,
    paddingLeft: 9, paddingRight: 6,
    paddingTop: 7, paddingBottom: 7,
  },
  whyTitle: { fontSize: 8, color: SLATE_900, fontWeight: 'bold', marginBottom: 3 },
  whyBody: { fontSize: 6.5, color: SLATE_600 },

  // CTA
  cta: {
    backgroundColor: SLATE_900,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: BRAND,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 14, paddingRight: 14,
    paddingTop: 12, paddingBottom: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  ctaLeft: { flex: 1, marginRight: 14 },
  ctaTitle: { fontSize: 10, color: WHITE, fontWeight: 'bold', marginBottom: 4 },
  ctaBody: { fontSize: 6.5, color: SLATE_400 },
  ctaBtn: {
    backgroundColor: BRAND,
    borderRadius: 3,
    paddingLeft: 12, paddingRight: 12,
    paddingTop: 7, paddingBottom: 7,
  },
  ctaBtnText: { fontSize: 7.5, color: WHITE, fontWeight: 'bold' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
  },
  footerLine: { height: 0.5, backgroundColor: '#e2e8f0', marginBottom: 5 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLogo: { width: 55, height: 17 },
  footerText: { fontSize: 5.5, color: SLATE_400, textAlign: 'right', flex: 1, marginLeft: 8 },
});

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.secRow}>
      <Text style={s.secTitle}>{title}</Text>
      <View style={s.secLine} />
    </View>
  );
}

interface Props {
  userData: UserData;
  ref_: string;
  today: Date;
  expiry: Date;
  logoUrl: string | null;
  lineItems: QuoteLineItem[];
  total: number;
  totalHours: number;
}

export function QuotePdfDocument({ userData, ref_, today, expiry, logoUrl, lineItems: LINE_ITEMS, total: TOTAL, totalHours: TOTAL_HOURS }: Props) {
  const allScope = [
    { l: 'Model',           v: userData.model_name },
    { l: 'Variants',        v: userData.unique_variants_count ? userData.unique_variants_count + ' grades' : '' },
    { l: 'Segment',         v: userData.segment },
    { l: 'Trim Levels',     v: userData.trim_levels ? userData.trim_levels + ' trims' : '' },
    { l: 'Exterior Colors', v: userData.exterior_colors ? userData.exterior_colors + ' colors' : '' },
    { l: 'Markets',         v: userData.markets },
    { l: 'Customization',   v: userData.customization_level },
    { l: 'CAD Format',      v: userData.cad_format },
    { l: 'Update Cycle',    v: userData.update_frequency },
  ].filter(r => r.v);

  // chunk into rows of 3
  const scopeChunks: typeof allScope[] = [];
  for (let i = 0; i < allScope.length; i += 3) scopeChunks.push(allScope.slice(i, i + 3));

  const WHY = [
    { title: 'Long Term ROI',        body: 'Virtual Twins reduce time-to-market by 25% and minimize physical prototyping costs.' },
    { title: 'Industry Standard',    body: "Join the world's leading OEMs already relying on the 3DEXPERIENCE platform." },
    { title: 'Seamless Integration', body: 'Compatible with SOLIDWORKS, CATIA V5/V6, and existing PLM infrastructure.' },
    { title: 'Enterprise Security',  body: 'IP protected by ISO 27001 certified cloud infrastructure.' },
  ];

  const contact = [userData.name, userData.email].filter(Boolean).join('   |   ') || 'Valued Customer';

  return (
    <Document title={`Dassault Quote ${ref_}`} author="Dassault Systemes">
      <Page size="A4" style={s.page}>

        {/* Left blue accent bar */}
        <View style={s.accentBar} fixed />

        {/* ── HEADER ── */}
        <View style={s.header}>
          <View style={s.logoBlock}>
            {logoUrl
              ? <Image style={s.logo} src={logoUrl} />
              : <Text style={s.logoFallback}>Dassault Systemes</Text>
            }
            <Text style={s.tagline}>Virtual Twin as a Service</Text>
          </View>
          <View style={s.headerDivider} />
          <View style={s.metaBlock}>
            <Text style={s.metaChip}>QUOTATION</Text>
            <Text style={s.metaRef}>{ref_}</Text>
            <Text style={s.metaLine}>Issued:      {fmtDate(today)}</Text>
            <Text style={s.metaLine}>Valid until: {fmtDate(expiry)}</Text>
          </View>
        </View>

        {/* ── PRICE BAND ── */}
        <View style={s.priceBand}>
          <View>
            <Text style={s.priceLabel}>TOTAL INVESTMENT</Text>
            <Text style={s.priceValue}>{fmt(TOTAL)}</Text>
            <Text style={s.priceSub}>USD  |  End-to-End Delivery</Text>
          </View>
          <View style={s.confBadge}>
            <Text style={s.confText}>CONFIDENTIAL</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={s.body}>

          {/* Prepared for */}
          <View style={s.prepBox}>
            <View style={s.prepLeft}>
              <Text style={s.prepChip}>PREPARED FOR</Text>
              <Text style={s.prepCompany}>{userData.company_name || 'Your Company'}</Text>
              <Text style={s.prepContact}>{contact}</Text>
            </View>
            <View style={s.assessBadge}>
              <Text style={s.assessText}>ASSESSMENT COMPLETE</Text>
            </View>
          </View>

          {/* ── SCOPE OF SERVICES ── */}
          <SectionHeader title="SCOPE OF SERVICES" />

          <View style={s.tableHead}>
            <Text style={s.thSvc}>SERVICE</Text>
            <Text style={s.thHrs}>HRS</Text>
            <Text style={s.thAmt}>AMOUNT (USD)</Text>
          </View>

          {LINE_ITEMS.map((item, i) => (
            <View key={i} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
              <View style={s.numCircle}>
                <Text style={s.numText}>{i + 1}</Text>
              </View>
              <View style={s.svcCol}>
                <Text style={s.svcName}>{item.label}</Text>
                <Text style={s.svcDesc}>{item.description}</Text>
              </View>
              <View style={s.hrsCol}>
                <Text style={s.hrsText}>{item.hours}h</Text>
              </View>
              <View style={s.amtCol}>
                <Text style={s.amtText}>{fmt(item.amount)}</Text>
              </View>
            </View>
          ))}

          <View style={s.divider} />

          {/* Totals */}
          <View style={s.totalsOuter}>
            <View style={s.totalsBox}>
              <View style={s.totRow}>
                <Text style={s.totLabel}>Subtotal</Text>
                <Text style={s.totVal}>{fmt(TOTAL)}</Text>
              </View>
              <View style={s.totRow}>
                <Text style={s.totLabel}>Tax (0% — B2B Enterprise)</Text>
                <Text style={s.totVal}>$0</Text>
              </View>
              <View style={s.totDivider} />
              <View style={s.totFinal}>
                <Text style={s.totFinalLabel}>Total</Text>
                <Text style={s.totFinalVal}>{fmt(TOTAL)}</Text>
              </View>
            </View>
          </View>

          {/* Stats bar */}
          <View style={s.statBar}>
            {[
              { l: 'TOTAL EFFORT',   v: TOTAL_HOURS + ' Hours' },
              { l: 'QUOTE VALIDITY', v: '30 Days' },
              { l: 'PAYMENT TERMS',  v: 'Net 30' },
            ].map((st, i, arr) => (
              <View key={i} style={i < arr.length - 1 ? s.statCell : s.statCellLast}>
                <Text style={s.statLabel}>{st.l}</Text>
                <Text style={s.statValue}>{st.v}</Text>
              </View>
            ))}
          </View>

          {/* ── PROJECT SCOPE ── */}
          {allScope.length > 0 && (
            <>
              <SectionHeader title="PROJECT SCOPE" />
              {scopeChunks.map((chunk, ri) => (
                <View key={ri} style={[s.scopeRow, { marginBottom: 3 }]}>
                  {chunk.map((r, ci) => (
                    <View key={ci} style={ci < chunk.length - 1 ? s.scopeCell : s.scopeCellLast}>
                      <Text style={s.scopeKey}>{r.l!.toUpperCase()}</Text>
                      <Text style={s.scopeVal}>{r.v}</Text>
                    </View>
                  ))}
                  {/* Fill empty slots to keep grid aligned */}
                  {chunk.length < 3 && Array.from({ length: 3 - chunk.length }).map((_, ei) => (
                    <View key={'e' + ei} style={ei < 3 - chunk.length - 1 ? s.scopeCell : s.scopeCellLast} />
                  ))}
                </View>
              ))}
              <View style={{ marginBottom: 10 }} />
            </>
          )}

          {/* ── WHY DASSAULT ── */}
          <SectionHeader title="WHY PARTNER WITH DASSAULT SYSTEMES" />
          <View style={s.whyRow}>
            <View style={s.whyCell}>
              <Text style={s.whyTitle}>{WHY[0].title}</Text>
              <Text style={s.whyBody}>{WHY[0].body}</Text>
            </View>
            <View style={s.whyCellLast}>
              <Text style={s.whyTitle}>{WHY[1].title}</Text>
              <Text style={s.whyBody}>{WHY[1].body}</Text>
            </View>
          </View>
          <View style={s.whyRow}>
            <View style={s.whyCell}>
              <Text style={s.whyTitle}>{WHY[2].title}</Text>
              <Text style={s.whyBody}>{WHY[2].body}</Text>
            </View>
            <View style={s.whyCellLast}>
              <Text style={s.whyTitle}>{WHY[3].title}</Text>
              <Text style={s.whyBody}>{WHY[3].body}</Text>
            </View>
          </View>

          {/* ── CTA ── */}
          <View style={s.cta}>
            <View style={s.ctaLeft}>
              <Text style={s.ctaTitle}>Ready to move forward?</Text>
              <Text style={s.ctaBody}>
                Our solution architects will review your specifications and confirm final pricing within 48 hours.
              </Text>
            </View>
            <View style={s.ctaBtn}>
              <Text style={s.ctaBtnText}>Schedule a Call</Text>
            </View>
          </View>

        </View>

        {/* ── FOOTER (fixed) ── */}
        <View style={s.footer} fixed>
          <View style={s.footerLine} />
          <View style={s.footerRow}>
            {logoUrl && <Image style={s.footerLogo} src={logoUrl} />}
            <Text style={s.footerText}>
              {'Quote ' + ref_ + '  |  Valid 30 days from ' + fmtDate(today) + '  |  (c) ' + today.getFullYear() + ' Dassault Systemes SE  |  Pricing subject to detailed scoping'}
            </Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
