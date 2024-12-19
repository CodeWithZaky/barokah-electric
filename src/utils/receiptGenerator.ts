export function receiptGenerator(prefix = "BE") {
  const date = new Date();

  // Format tanggal dalam format YYYYMMDD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}${month}${day}`;

  // Generate nomor unik (6 digit random number)
  const uniqueNumber = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number

  // Gabungkan prefix, tanggal, dan nomor unik
  return `${prefix}-${formattedDate}-${uniqueNumber}`;
}
