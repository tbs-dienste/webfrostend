import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
  },
  divider: {
    borderBottom: '1px solid #000',
    marginTop: 5,
    marginBottom: 5,
  },
});

const ReceiptPDF = ({ receipt }) => {
  const {
    transaction_id,
    products,
    total,
    card_type,
    terminal_id,
    trx_ref_no,
    auth_code,
    not_discountable,
    tax_included,
    tax_info,
    served_by,
    thank_you_message,
    company_info,
  } = receipt || {};

  const formatPrice = (price) => {
    return price ? `${parseFloat(price).toFixed(2)} CHF` : 'Nicht verfügbar';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>QUITTUNG</Text>
          <Text>{new Date().toLocaleString('de-DE')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaktionsdetails</Text>
          <View style={styles.detailRow}>
            <Text>Transaktions-ID:</Text>
            <Text>{transaction_id || 'Nicht verfügbar'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>Zahlungsmethode:</Text>
            <Text>{card_type || 'Nicht verfügbar'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>Terminal-ID:</Text>
            <Text>{terminal_id || 'Nicht verfügbar'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>Transaktionsnummer:</Text>
            <Text>{trx_ref_no || 'Nicht verfügbar'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>Buchungscode:</Text>
            <Text>{auth_code || 'Nicht verfügbar'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produkte</Text>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product, index) => (
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

        <View style={styles.totalRow}>
          <Text>Total:</Text>
          <Text>{formatPrice(total)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <Text>{not_discountable || 'Nicht verfügbar'}</Text>
          <Text>{tax_included || 'Nicht verfügbar'}</Text>
          <Text>{tax_info || 'Nicht verfügbar'}</Text>
          <Text>{served_by || 'Nicht verfügbar'}</Text>
          <Text>{thank_you_message || 'Nicht verfügbar'}</Text>
          <Text>{company_info || 'Nicht verfügbar'}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
