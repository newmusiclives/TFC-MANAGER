/**
 * Lightweight client-side export utilities (PDF via print, CSV via Blob).
 */

export function exportToPDF(elementId: string, filename: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`exportToPDF: element #${elementId} not found`);
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.warn("exportToPDF: popup blocked");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; font-size: 13px; }
          th { background: #f5f5f5; font-weight: 600; }
        </style>
      </head>
      <body>${element.innerHTML}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}

export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (!data.length) {
    console.warn("exportToCSV: no data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
