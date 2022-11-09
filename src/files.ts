export const getBase64FromURL = async (src: string): Promise<string> => {
  const res: Response = await fetch(src);
  const blob = await res.blob();

  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onloadend = () => {
      let result = reader.result as string;

      // По какой-то причине приходит xml+svg, img такую строку отобразить не может
      result = result.replace('xml+svg', 'svg+xml');

      resolve(result);
    };

    reader.readAsDataURL(blob);
  });
};
