export const unduhFile = (namaFile, isiFile, tipeMime) => {
  const blob = new Blob([isiFile], { type: tipeMime });
  const url = URL.createObjectURL(blob);

  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = namaFile;
  document.body.appendChild(tautan);
  tautan.click();
  document.body.removeChild(tautan);

  URL.revokeObjectURL(url);
};