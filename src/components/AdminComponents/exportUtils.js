// src/components/AdminComponents/exportUtils.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to format currency for reports
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value || 0);

// Helper to format dates for PDF headers
const formatDateForReport = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Helper to format datetimes for transaction rows
const formatDateForTransaction = (dateString) => new Date(dateString).toLocaleString();

// --- Performance Report Exports ---

export const exportPerformanceToPDF = (data, startDate, endDate) => {
  if (!data || !data.summary || !data.item_performance) return;

  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("Luk's by GoodChoice", 105, 20, { align: "center" });
  doc.setFontSize(16);
  doc.text("Sales Performance Report", 105, 30, { align: "center" });
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Sub-header
  doc.setFontSize(10);
  doc.text(`Report Period: ${formatDateForReport(startDate)} to ${formatDateForReport(endDate)}`, 20, 45);
  doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 20, 50);
  doc.line(20, 55, 190, 55);

  // Summary Section
  doc.setFontSize(12);
  doc.text("Summary", 105, 65, { align: "center" });

  const summaryText = [
    `Total Revenue: ${formatCurrency(data.summary.total_revenue)}`,
    `Total Orders: ${data.summary.total_orders || 0}`,
    `Total Items Sold: ${data.summary.total_items_sold || 0}`,
    `Average Order Value: ${formatCurrency(data.summary.average_order_value)}`,
  ];
  doc.setFontSize(11);
  doc.text(summaryText[0], 30, 75);
  doc.text(summaryText[1], 110, 75);
  doc.text(summaryText[2], 30, 82);
  doc.text(summaryText[3], 110, 82);
  doc.line(20, 90, 190, 90);

  // Item Performance Table
  doc.setFontSize(12);
  doc.text("Item Performance Details", 105, 100, { align: "center" });

  const tableColumn = ["Item", "Variation", "Units Sold", "Total Revenue"];
  const tableRows = [];

  data.item_performance.forEach((item) => {
    const itemData = [
      item.item_name,
      item.variation_name,
      item.units_sold.toString(),
      formatCurrency(item.total_revenue),
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 105,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
    didDrawPage: function (data) {
      doc.setFontSize(8);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
    },
  });

  doc.save(`performance_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.pdf`);
};

export const exportPerformanceToCSV = (data) => {
  if (!data || !data.item_performance) return;

  const headers = ["Item Name", "Variation", "Units Sold", "Average Price", "Total Revenue"];
  
  const rows = data.item_performance.map(item => [
    `"${item.item_name.replace(/"/g, '""')}"`,
    `"${item.variation_name.replace(/"/g, '""')}"`,
    item.units_sold,
    item.average_price,
    item.total_revenue
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'performance_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// --- Transaction History Exports ---

export const exportTransactionsToPDF = (transactions, startDate, endDate) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Transaction History Report", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Report Period: ${formatDateForReport(startDate)} to ${formatDateForReport(endDate)}`, 20, 30);

  const tableColumn = ["Order #", "Date", "Type", "Customer/Staff", "Total"];
  const tableRows = [];

  transactions.forEach(t => {
    const customer = t.user ? `${t.user.first_name} ${t.user.last_name}` : (t.processed_by_staff ? t.processed_by_staff.first_name : "Walk-in");
    const row = [
      t.order_number,
      formatDateForTransaction(t.processed_at),
      t.type,
      customer,
      formatCurrency(t.total_amount)
    ];
    tableRows.push(row);
  });

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 35 });
  doc.save(`transaction_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.pdf`);
};

export const exportTransactionsToCSV = (transactions) => {
  const headers = ["Order Number", "Date", "Type", "Customer/Staff", "Items", "Total Amount"];
  const rows = transactions.map(t => {
      const customer = t.user ? `${t.user.first_name} ${t.user.last_name}` : (t.processed_by_staff ? t.processed_by_staff.first_name : "Walk-in");
      return [
          t.order_number,
          formatDateForTransaction(t.processed_at),
          t.type,
          `"${customer.replace(/"/g, '""')}"`,
          `"${t.items_summary.replace(/"/g, '""')}"`,
          t.total_amount
      ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'transaction_report.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};