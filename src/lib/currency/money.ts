export const formatMoney = (value: any) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "PEN",
  }).format(value);
