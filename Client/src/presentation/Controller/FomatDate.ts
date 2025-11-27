export const getLocalDate = (str: string) => {
      const [datePart] = str.split("T");
      const [y, m, d] = datePart.split("-").map(Number);
      return `${d}/${m}/${y}`;
    };