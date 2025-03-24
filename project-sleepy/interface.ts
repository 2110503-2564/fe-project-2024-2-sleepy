export interface MSItem {
  _id: string,
  name: string,
  address: string,
  district: string,
  province: string,
  postalcode: string,
  tel: string,
  openTime: string,
  closeTime: number,
  isActive: boolean
}

export interface MSJson {
  success: boolean,
  count: number,
  pagination: {
    next: {
      page: number,
      limit: number
    },
    prev: {
      page: number,
      limit: number
    }
  },
  data: MSItem[]
}

export interface BookingItem {
  nameLastname: string;
  tel: string;
  MassageShop: string;
  bookDate: string;
}