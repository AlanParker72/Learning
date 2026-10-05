/**
 * Form stubs + dashboard JSON field catalog.
 *
 * TODO: swap `useFormConfig` / `Fields` / `Form` for the real company `@dsp` form lib.
 */
export { Fields, Form } from './Fields'
export { useFormConfig } from './useFormConfig'
export {
  DASHBOARD_FORM_FIELDS,
  FORM_FIELD_KEY_BY_PERMISSION,
  dashboardFormConfig,
  initialValuesFromFormConfig,
  pickFormFields,
  resolveFormConfigForTab
} from './formConfigs/dashboardFormConfig'
export type {
  FormConfig,
  FormFieldConfig,
  FormHandle,
  FormInputType,
  FormValues,
  UseFormConfigOptions
} from './types'
