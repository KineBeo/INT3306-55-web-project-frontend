const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export default formatCurrency;
