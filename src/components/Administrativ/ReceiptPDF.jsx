// src/components/ReceiptPDF.jsx
import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 25, fontWeight: 'bold' },
  section: { marginBottom: 15 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 5 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  footer: { marginTop: 20, textAlign: 'center', fontSize: 12, color: '#555' },
  divider: { borderBottomWidth: 1, borderColor: '#000', marginVertical: 5 },
});

const ReceiptPDF = ({ receipt }) => {
  const formatPrice = (price) => (price ? `${parseFloat(price).toFixed(2)} CHF` : 'Nicht verfügbar');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>QUITTUNG</Text>
          <Text>{new Date(receipt.createdAt || Date.now()).toLocaleString('de-DE')}</Text>
        </View>

        {/* Transaktionsdetails */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaktionsdetails</Text>
          <View style={styles.detailRow}>
            <Text>Transaktions-ID:</Text>
            <Text>{receipt.transaction_id || 'Nicht verfügbar'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>Zahlungsmethode:</Text>
            <Text>{receipt.method}{receipt.card_type ? ` (${receipt.card_type})` : ''}</Text>
          </View>
          {receipt.terminal_id && (
            <View style={styles.detailRow}>
              <Text>Terminal-ID:</Text>
              <Text>{receipt.terminal_id}</Text>
            </View>
          )}
          {receipt.akt_id && (
            <View style={styles.detailRow}>
              <Text>Akt-ID:</Text>
              <Text>{receipt.akt_id}</Text>
            </View>
          )}
          {receipt.aid && (
            <View style={styles.detailRow}>
              <Text>AID:</Text>
              <Text>{receipt.aid}</Text>
            </View>
          )}
          {receipt.trx_seq_cnt && (
            <View style={styles.detailRow}>
              <Text>Trx Seq-Cnt:</Text>
              <Text>{receipt.trx_seq_cnt}</Text>
            </View>
          )}
          {receipt.trx_ref_no && (
            <View style={styles.detailRow}>
              <Text>Trx Ref-No:</Text>
              <Text>{receipt.trx_ref_no}</Text>
            </View>
          )}
          {receipt.auth_code && (
            <View style={styles.detailRow}>
              <Text>Buchungscode:</Text>
              <Text>{receipt.auth_code}</Text>
            </View>
          )}
          {receipt.emv_atc && (
            <View style={styles.detailRow}>
              <Text>EMV ATC:</Text>
              <Text>{receipt.emv_atc}</Text>
            </View>
          )}
          {receipt.mixed_code && (
            <View style={styles.detailRow}>
              <Text>Mixed Code:</Text>
              <Text>{receipt.mixed_code}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Produkte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produkte</Text>
          {Array.isArray(receipt.products) && receipt.products.length > 0 ? (
            receipt.products.map((product, index) => (
              <View style={styles.productRow} key={index}>
                <Text>{product.article}</Text>
                <Text>{product.quantity} x {product.price} CHF</Text>
                <Text>{(product.quantity * parseFloat(product.price)).toFixed(2)} CHF</Text>
              </View>
            ))
          ) : (
            <Text>Keine Produkte verfügbar.</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Total */}
        <View style={styles.totalRow}>
          <Text>Total:</Text>
          <Text>{formatPrice(receipt.total)}</Text>
        </View>
        {receipt.total_eft && (
          <View style={styles.totalRow}>
            <Text>Total-EFT:</Text>
            <Text>{formatPrice(receipt.total_eft)}</Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{receipt.not_discountable || ''}</Text>
          <Text>{receipt.tax_included || ''}</Text>
          <Text>{receipt.tax_info || ''}</Text>
          <Text>{receipt.served_by || ''}</Text>
          <Text>{receipt.thank_you_message || ''}</Text>
          <Text>{receipt.company_info || ''}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
