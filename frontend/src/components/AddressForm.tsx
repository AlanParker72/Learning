import { useMemo, useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, Stack, TextField, Typography, Alert, Paper } from '@mui/material';
import debounce from 'lodash.debounce';
import { Controller, useForm } from 'react-hook-form';
import { fetchAddressDetails, fetchAddressSuggestions } from '../api/addressApi';
import type { AddressFormValues, AddressSuggestion } from '../types/address';

const defaultValues: AddressFormValues = { addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: '' };

export function AddressForm() {
  const { control, setValue, handleSubmit, watch } = useForm<AddressFormValues>({ defaultValues });
  const [options, setOptions] = useState<AddressSuggestion[]>([]);
  const [selected, setSelected] = useState<AddressSuggestion | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID());

  const searchAddresses = useMemo(() => debounce(async (input: string) => {
    if (input.trim().length < 3) { setOptions([]); return; }
    setLoadingSuggestions(true);
    setError(null);
    try { setOptions(await fetchAddressSuggestions(input, sessionToken)); }
    catch { setError('Unable to load address suggestions. Check backend/API key.'); }
    finally { setLoadingSuggestions(false); }
  }, 350), [sessionToken]);

  const handleSelect = async (value: AddressSuggestion | null) => {
    setSelected(value);
    if (!value) return;
    setLoadingDetails(true);
    setError(null);
    try {
      const details = await fetchAddressDetails(value.placeId, sessionToken);
      setValue('addressLine1', details.addressLine1 || value.mainText || value.description, { shouldValidate: true });
      setValue('city', details.city || '', { shouldValidate: true });
      setValue('state', details.state || '', { shouldValidate: true });
      setValue('zipCode', details.zipCode || '', { shouldValidate: true });
      setValue('country', details.country || '', { shouldValidate: true });
      setSessionToken(crypto.randomUUID());
    } catch {
      setError('Unable to load selected address details.');
    } finally { setLoadingDetails(false); }
  };

  return <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 4 }}>
    <Typography variant="h5" fontWeight={700} mb={3}>Google Places Address Demo</Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Box component="form" onSubmit={handleSubmit(v => alert(JSON.stringify(v, null, 2)))}>
      <Stack spacing={2}>
        <Controller name="addressLine1" control={control} rules={{ required: 'Address Line 1 is required' }} render={({ field, fieldState }) => (
          <Autocomplete
            fullWidth
            value={selected}
            inputValue={inputValue}
            options={options}
            loading={loadingSuggestions || loadingDetails}
            filterOptions={(x) => x}
            getOptionLabel={(o) => o.description ?? ''}
            isOptionEqualToValue={(o, v) => o.placeId === v.placeId}
            onInputChange={(_, newInput, reason) => {
              setInputValue(newInput);
              field.onChange(newInput);
              if (reason === 'input') searchAddresses(newInput);
            }}
            onChange={(_, newValue) => handleSelect(newValue)}
            renderOption={(props, option) => <Box component="li" {...props} key={option.placeId}><Box><Typography fontWeight={600}>{option.mainText}</Typography><Typography variant="body2" color="text.secondary">{option.secondaryText}</Typography></Box></Box>}
            renderInput={(params) => <TextField {...params} label="Address Line 1" placeholder="Try 10444" error={!!fieldState.error} helperText={fieldState.error?.message ?? 'Type 3+ characters, then select a suggestion'} InputProps={{ ...params.InputProps, endAdornment: <>{(loadingSuggestions || loadingDetails) && <CircularProgress size={18} />}{params.InputProps.endAdornment}</> }} />}
          />
        )} />
        <Controller name="addressLine2" control={control} render={({ field }) => <TextField {...field} label="Address Line 2" fullWidth />} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller name="city" control={control} render={({ field }) => <TextField {...field} label="City" fullWidth />} />
          <Controller name="state" control={control} render={({ field }) => <TextField {...field} label="State" fullWidth />} />
          <Controller name="zipCode" control={control} render={({ field }) => <TextField {...field} label="ZIP Code" fullWidth />} />
        </Stack>
        <Controller name="country" control={control} render={({ field }) => <TextField {...field} label="Country" fullWidth />} />
        <Button type="submit" variant="contained" size="large">Show Form JSON</Button>
      </Stack>
    </Box>
    <Typography variant="caption" component="pre" sx={{ display: 'block', mt: 3, p: 2, bgcolor: '#f6f6f6', overflow: 'auto' }}>{JSON.stringify(watch(), null, 2)}</Typography>
  </Paper>;
}
