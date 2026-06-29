export type AddressSuggestion = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

export type AddressDetails = {
  placeId: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
};

export type AddressFormValues = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};
