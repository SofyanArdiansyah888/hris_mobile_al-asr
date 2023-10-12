import moment from "moment";

const sanitizeNumber = (stringNumber: string) => {
  return Number(stringNumber.replace(/\D/g, ""));
};

const tanggalFilter = () => {
  let days = moment();
  if(days.date() > 21 ){
    return moment().add(1,'month').format('MMMM YYYY')
  }
  return moment().format('MMMM YYYY')
}

const defaultDate = () => {
  return moment().date() > 22 ? moment().add('month',1)
        .format('yyyy-MM-DD') : moment().format('yyyy-MM-DD')
}

function formatRupiah(angka: number | string | undefined, prefix: string = "Rp.") {
  if (angka) {
    const tempAngka = angka.toString();
    var number_string = tempAngka.replace(/[^,\d]/g, "").toString(),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return `${prefix} ${rupiah}`;
  } else {
    return `${prefix} 0`;
  }
}

function formatThousand(angka: number | string | undefined, prefix: string = "") {
  if (angka) {
    const tempAngka = angka.toString();
    var number_string = tempAngka.replace(/[^,\d]/g, "").toString(),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return `${prefix} ${rupiah}`;
  } else {
    return `${prefix} 0`;
  }
}

export {sanitizeNumber, formatRupiah,formatThousand,tanggalFilter,defaultDate}
