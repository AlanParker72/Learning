import axios from 'axios';
import type { AddressDetails, AddressSuggestion } from '../types/address';

const api = axios.create({ baseURL: 'http://localhost:8080/api', timeout: 8000 });

export async function fetchAddressSuggestions(input: string, sessionToken: string): Promise<AddressSuggestion[]> {
  const { data } = await api.get<AddressSuggestion[]>('/addresses/autocomplete', { params: { input, sessionToken } });
  return data;
}

export async function fetchAddressDetails(placeId: string, sessionToken: string): Promise<AddressDetails> {
  const { data } = await api.get<AddressDetails>('/addresses/details', { params: { placeId, sessionToken } });
  return data;
}
