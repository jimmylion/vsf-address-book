export default interface Address {
  city: string;
  country: string;
  firstName: string;
  house: string;
  lastName: string;
  phone: string;
  postcode: string;
  region: string;
  region_id?: string | number;
  street: string;
  default_shipping: boolean;
  default_billing: boolean;
}
