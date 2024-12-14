export const formatDateToDDMMYYYY = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

export const formatDateToYYYYMMDD = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${year}-${month}-${day}`;
}

export const formatToDdMmYyyyHhMm = (dateStr: string) => {
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, '0');  // Ngày
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Tháng (0-based)
  const year = date.getFullYear();  // Năm

  const hours = String(date.getHours()).padStart(2, '0');  // Giờ
  const minutes = String(date.getMinutes()).padStart(2, '0');  // Phút

  // Trả về định dạng dd/mm/yyyy, hh-mm
  return `${day}/${month}/${year}, ${hours}h${minutes}`;
}

export const formatToYyyyMmDdTmm = (dateStr: string) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();  // Năm
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Tháng (0-based)
  const day = String(date.getDate()).padStart(2, '0');  // Ngày

  const hours = String(date.getHours()).padStart(2, '0');  // Giờ
  const minutes = String(date.getMinutes()).padStart(2, '0');  // Phút

  // Trả về định dạng yyyy-mm-ddThh:mm
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
