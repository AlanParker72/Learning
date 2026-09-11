import type { DeliveryApiItem, DeliveriesListResponseApi } from '../api/contracts'
import { toDashboardRange, type DashboardRangeApi } from '../api/contracts'
import { parseFlexibleDate } from '../utils/format'

/**
 * Search fields for stub filtering.
 * ProspectId: no dedicated API field — filter where recipientType is PROSPECT
 * and match against customerId / recipientId.
 */
export type DeliveriesStubSearchField = 'customerId' | 'prospectId' | 'source'

export type DeliveriesStubParams = {
  search?: string
  searchBy?: DeliveriesStubSearchField
  status?: string | string[]
  channel?: string
  page?: number
  pageSize?: number
  range?: string
  sortField?: 'dateTime'
  sortDir?: 'asc' | 'desc'
}

/**
 * Static stub deliveries — literal records only (no loops, date math, or formulas).
 * Enough rows for pagination / filter testing.
 */
const DELIVERIES: DeliveryApiItem[] = [
  {
    referenceId: 463,
    recipients: {
      to: ['sam.prad@test.com', 'sam.prad2@test.com'],
      cc: ['sam.prad@test.com', 'sam.prad2@test.com'],
      bcc: ['sam.prad@test.com', 'sam.prad2@test.com']
    },
    tenantId: 'FCB',
    correlationId: '24ba5d35-7bb1-48be-8a48-1c6c875b995a',
    customerId: '123',
    recipientType: 'CUSTOMER',
    recipientId: null,
    applicationId: null,
    accountId: null,
    source: 'DIRECT DEPOSIT1',
    function: null,
    deliveryDateTime: '2026-09-10T15:56:02.497',
    deliveryStatus: 'ERROR_STOP',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: 'Unexpected error in REST call',
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-09-11T17:43:58.682'
      }
    ]
  },
  {
    referenceId: 401,
    recipients: {
      to: ['to+001@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'FCB',
    correlationId: '00000191-0000-4000-8000-000000000191',
    customerId: '1001',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3001',
    applicationId: 'APP-5001',
    accountId: 'ACCT-6001',
    source: 'DIRECT DEPOSIT1',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-11T09:03:00.000',
    deliveryStatus: 'NEW',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 401.',
        acttion: 'RETRY',
        commentedBy: 'Delivery Manager',
        commentedDate: '2026-09-11T10:15:00.000'
      }
    ]
  },
  {
    referenceId: 410,
    recipients: {
      to: ['to+010@test.com', 'to2+10@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'OAO',
    correlationId: '0000019a-0000-4000-8000-00000000019a',
    customerId: '1010',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3010',
    applicationId: 'APP-5010',
    accountId: null,
    source: 'Invoice',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-02T18:30:03.000',
    deliveryStatus: 'NEW',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: []
  },
  {
    referenceId: 402,
    recipients: {
      to: ['to+002@test.com', 'to2+2@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'Mosaic',
    correlationId: '00000192-0000-4000-8000-000000000192',
    customerId: '1002',
    recipientType: 'PROSPECT',
    recipientId: 'P-2002',
    applicationId: 'APP-5002',
    accountId: 'ACCT-6002',
    source: 'Mosaic',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-10T10:06:07.000',
    deliveryStatus: 'DISPATCHED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 402.',
        acttion: 'ACKNOWLEDGE',
        commentedBy: 'Ops Team',
        commentedDate: '2026-09-11T10:15:00.000'
      }
    ]
  },
  {
    referenceId: 411,
    recipients: {
      to: ['to+011@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'FCB',
    correlationId: '0000019b-0000-4000-8000-00000000019b',
    customerId: '1011',
    recipientType: 'PROSPECT',
    recipientId: 'P-2011',
    applicationId: 'APP-5011',
    accountId: 'ACCT-6011',
    source: 'Direct Deposit',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-01T19:33:10.000',
    deliveryStatus: 'DISPATCHED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true
  },
  {
    referenceId: 403,
    recipients: {
      to: ['to+003@test.com'],
      cc: ['cc+3@test.com'],
      bcc: []
    },
    tenantId: 'CIT',
    correlationId: '00000193-0000-4000-8000-000000000193',
    customerId: '1003',
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3003',
    applicationId: 'APP-5003',
    accountId: 'ACCT-6003',
    source: 'OAO',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-09T11:09:14.000',
    deliveryStatus: 'ERROR_STOP',
    deliveryChannel: 'PUSH',
    failureReason: 'Mailbox full',
    retryCount: 3,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: [
      {
        comment: 'Queued for handoff.',
        acttion: 'RETRY',
        commentedBy: 'Support Queue',
        commentedDate: '2026-09-10T12:20:07.000'
      },
      {
        comment: 'Follow-up note.',
        acttion: 'ACKNOWLEDGE',
        commentedBy: 'Ops Team',
        commentedDate: '2026-09-10T14:05:07.000'
      }
    ]
  },
  {
    referenceId: 412,
    recipients: {
      to: ['to+012@test.com', 'to2+12@test.com'],
      cc: ['cc+12@test.com'],
      bcc: ['bcc+12@test.com']
    },
    tenantId: 'Mosaic',
    correlationId: '0000019c-0000-4000-8000-00000000019c',
    customerId: '1012',
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3012',
    applicationId: null,
    accountId: 'ACCT-6012',
    source: 'Prospect Management',
    function: null,
    deliveryDateTime: '2026-08-31T08:36:17.000',
    deliveryStatus: 'ERROR_STOP',
    deliveryChannel: 'PUSH',
    failureReason: 'Device unreachable',
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-09-01T17:43:10.000'
      }
    ]
  },
  {
    referenceId: 404,
    recipients: {
      to: ['to+004@test.com', 'to2+4@test.com'],
      cc: [],
      bcc: ['bcc+4@test.com']
    },
    tenantId: 'AAO',
    correlationId: '00000194-0000-4000-8000-000000000194',
    customerId: '1004',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3004',
    applicationId: null,
    accountId: 'ACCT-6004',
    source: 'Invoice',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-08T12:12:21.000',
    deliveryStatus: 'ERROR_RETRY',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: 'Invalid recipient',
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-09-09T17:43:14.000'
      }
    ]
  },
  {
    referenceId: 413,
    recipients: {
      to: ['to+013@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'CIT',
    correlationId: '0000019d-0000-4000-8000-00000000019d',
    customerId: '1013',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3013',
    applicationId: 'APP-5001',
    accountId: 'ACCT-6013',
    source: 'DIRECT DEPOSIT1',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-30T09:39:24.000',
    deliveryStatus: 'ERROR_RETRY',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: 'Template render error',
    retryCount: 1,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 413.',
        acttion: 'RETRY',
        commentedBy: 'Delivery Manager',
        commentedDate: '2026-08-31T10:15:17.000'
      }
    ]
  },
  {
    referenceId: 405,
    recipients: {
      to: ['to+005@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'OAO',
    correlationId: '00000195-0000-4000-8000-000000000195',
    customerId: '1005',
    recipientType: 'PROSPECT',
    recipientId: 'P-2005',
    applicationId: 'APP-5005',
    accountId: null,
    source: 'Direct Deposit',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-07T13:15:28.000',
    deliveryStatus: 'PROCESSING',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: []
  },
  {
    referenceId: 414,
    recipients: {
      to: ['to+014@test.com', 'to2+14@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'AAO',
    correlationId: '0000019e-0000-4000-8000-00000000019e',
    customerId: '1014',
    recipientType: 'PROSPECT',
    recipientId: null,
    applicationId: 'APP-5002',
    accountId: 'ACCT-6014',
    source: 'Mosaic',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-29T10:42:31.000',
    deliveryStatus: 'PROCESSING',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 414.',
        acttion: 'ACKNOWLEDGE',
        commentedBy: 'Ops Team',
        commentedDate: '2026-08-30T10:15:24.000'
      }
    ]
  },
  {
    referenceId: 406,
    recipients: {
      to: ['to+006@test.com', 'to2+6@test.com'],
      cc: ['cc+6@test.com'],
      bcc: []
    },
    tenantId: 'FCB',
    correlationId: '00000196-0000-4000-8000-000000000196',
    customerId: '1006',
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3006',
    applicationId: 'APP-5006',
    accountId: 'ACCT-6006',
    source: 'Prospect Management',
    function: null,
    deliveryDateTime: '2026-09-06T14:18:35.000',
    deliveryStatus: 'QUEUED',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: [
      {
        comment: 'Queued for handoff.',
        acttion: 'RETRY',
        commentedBy: 'Support Queue',
        commentedDate: '2026-09-07T12:20:28.000'
      },
      {
        comment: 'Follow-up note.',
        acttion: 'ACKNOWLEDGE',
        commentedBy: 'Ops Team',
        commentedDate: '2026-09-07T14:05:28.000'
      }
    ]
  },
  {
    referenceId: 415,
    recipients: {
      to: ['to+015@test.com'],
      cc: ['cc+15@test.com'],
      bcc: []
    },
    tenantId: 'OAO',
    correlationId: '0000019f-0000-4000-8000-00000000019f',
    customerId: null,
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3015',
    applicationId: 'APP-5003',
    accountId: null,
    source: 'OAO',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-28T11:45:38.000',
    deliveryStatus: 'QUEUED',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: false,
    comments: []
  },
  {
    referenceId: 407,
    recipients: {
      to: ['to+007@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'Mosaic',
    correlationId: '00000197-0000-4000-8000-000000000197',
    customerId: '1007',
    recipientType: 'CUSTOMER',
    recipientId: null,
    applicationId: 'APP-5007',
    accountId: 'ACCT-6007',
    source: 'DIRECT DEPOSIT1',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-05T15:21:42.000',
    deliveryStatus: 'FAILED_RETRY',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: null,
    retryCount: 3,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 407.',
        acttion: 'RETRY',
        commentedBy: 'Delivery Manager',
        commentedDate: '2026-09-06T10:15:35.000'
      }
    ]
  },
  {
    referenceId: 416,
    recipients: {
      to: ['to+016@test.com', 'to2+16@test.com'],
      cc: [],
      bcc: ['bcc+16@test.com']
    },
    tenantId: 'FCB',
    correlationId: '000001a0-0000-4000-8000-0000000001a0',
    customerId: '1016',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3016',
    applicationId: null,
    accountId: 'ACCT-6001',
    source: 'Invoice',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-27T12:48:45.000',
    deliveryStatus: 'FAILED_RETRY',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: 'Upstream provider timeout',
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-08-28T17:43:38.000'
      }
    ]
  },
  {
    referenceId: 408,
    recipients: {
      to: ['to+008@test.com', 'to2+8@test.com'],
      cc: [],
      bcc: ['bcc+8@test.com']
    },
    tenantId: 'CIT',
    correlationId: '00000198-0000-4000-8000-000000000198',
    customerId: '1008',
    recipientType: 'PROSPECT',
    recipientId: 'P-2008',
    applicationId: null,
    accountId: 'ACCT-6008',
    source: 'Mosaic',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-04T16:24:49.000',
    deliveryStatus: 'ACKNOWLEDGED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-09-05T17:43:42.000'
      }
    ]
  },
  {
    referenceId: 417,
    recipients: {
      to: ['to+017@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'Mosaic',
    correlationId: '000001a1-0000-4000-8000-0000000001a1',
    customerId: '1017',
    recipientType: 'PROSPECT',
    recipientId: 'P-2017',
    applicationId: 'APP-5005',
    accountId: 'ACCT-6002',
    source: 'Direct Deposit',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-08-26T13:51:52.000',
    deliveryStatus: 'ACKNOWLEDGED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 417.',
        acttion: 'RETRY',
        commentedBy: 'Delivery Manager',
        commentedDate: '2026-08-27T10:15:45.000'
      }
    ]
  },
  {
    referenceId: 409,
    recipients: {
      to: ['to+009@test.com'],
      cc: ['cc+9@test.com'],
      bcc: []
    },
    tenantId: 'AAO',
    correlationId: '00000199-0000-4000-8000-000000000199',
    customerId: '1009',
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3009',
    applicationId: 'APP-5009',
    accountId: 'ACCT-6009',
    source: 'OAO',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-03T17:27:56.000',
    deliveryStatus: 'COMPLETE',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: false,
    comments: null
  },
  {
    referenceId: 418,
    recipients: {
      to: ['to+018@test.com', 'to2+18@test.com'],
      cc: ['cc+18@test.com'],
      bcc: []
    },
    tenantId: 'CIT',
    correlationId: '000001a2-0000-4000-8000-0000000001a2',
    customerId: '1018',
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3018',
    applicationId: 'APP-5006',
    accountId: 'ACCT-6003',
    source: 'Prospect Management',
    function: null,
    deliveryDateTime: '2026-08-25T14:54:59.000',
    deliveryStatus: 'COMPLETE',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: null
  },
  {
    referenceId: 420,
    recipients: {
      to: ['to+020@test.com', 'to2+20@test.com'],
      cc: [],
      bcc: ['bcc+20@test.com']
    },
    tenantId: 'OAO',
    correlationId: '000001a4-0000-4000-8000-0000000001a4',
    customerId: '1020',
    recipientType: 'PROSPECT',
    recipientId: 'P-2020',
    applicationId: null,
    accountId: null,
    source: 'Mosaic',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-23T16:00:13.000',
    deliveryStatus: 'DISPATCHED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: []
  },
  {
    referenceId: 423,
    recipients: {
      to: ['to+023@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'CIT',
    correlationId: '000001a7-0000-4000-8000-0000000001a7',
    customerId: '1023',
    recipientType: 'PROSPECT',
    recipientId: 'P-2023',
    applicationId: 'APP-5011',
    accountId: 'ACCT-6008',
    source: 'Direct Deposit',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-08-20T19:09:34.000',
    deliveryStatus: 'PROCESSING',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 423.',
        acttion: 'RETRY',
        commentedBy: 'Delivery Manager',
        commentedDate: '2026-08-21T10:15:27.000'
      }
    ]
  },
  {
    referenceId: 424,
    recipients: {
      to: ['to+024@test.com', 'to2+24@test.com'],
      cc: ['cc+24@test.com'],
      bcc: ['bcc+24@test.com']
    },
    tenantId: 'AAO',
    correlationId: '000001a8-0000-4000-8000-0000000001a8',
    customerId: '1024',
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3024',
    applicationId: null,
    accountId: 'ACCT-6009',
    source: 'Prospect Management',
    function: null,
    deliveryDateTime: '2026-08-19T08:12:41.000',
    deliveryStatus: 'QUEUED',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-08-20T17:43:34.000'
      }
    ]
  },
  {
    referenceId: 425,
    recipients: {
      to: ['to+025@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'OAO',
    correlationId: '000001a9-0000-4000-8000-0000000001a9',
    customerId: '1025',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3025',
    applicationId: 'APP-5001',
    accountId: null,
    source: 'DIRECT DEPOSIT1',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-18T09:15:48.000',
    deliveryStatus: 'FAILED_RETRY',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: 'Invalid recipient',
    retryCount: 1,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: []
  },
  {
    referenceId: 426,
    recipients: {
      to: ['to+026@test.com', 'to2+26@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'FCB',
    correlationId: '000001aa-0000-4000-8000-0000000001aa',
    customerId: '1026',
    recipientType: 'PROSPECT',
    recipientId: 'P-2026',
    applicationId: 'APP-5002',
    accountId: 'ACCT-6011',
    source: 'Mosaic',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-17T10:18:55.000',
    deliveryStatus: 'ACKNOWLEDGED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 426.',
        acttion: 'ACKNOWLEDGE',
        commentedBy: 'Ops Team',
        commentedDate: '2026-08-18T10:15:48.000'
      }
    ]
  },
  {
    referenceId: 427,
    recipients: {
      to: ['to+027@test.com'],
      cc: ['cc+27@test.com'],
      bcc: []
    },
    tenantId: 'Mosaic',
    correlationId: '000001ab-0000-4000-8000-0000000001ab',
    customerId: '1027',
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3027',
    applicationId: 'APP-5003',
    accountId: 'ACCT-6012',
    source: 'OAO',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-16T11:21:02.000',
    deliveryStatus: 'COMPLETE',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: false,
    comments: null
  },
  {
    referenceId: 429,
    recipients: {
      to: ['to+029@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'AAO',
    correlationId: '000001ad-0000-4000-8000-0000000001ad',
    customerId: '1029',
    recipientType: 'PROSPECT',
    recipientId: 'P-2029',
    applicationId: 'APP-5005',
    accountId: 'ACCT-6014',
    source: 'Direct Deposit',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-08-14T13:27:16.000',
    deliveryStatus: 'DISPATCHED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 429.',
        acttion: 'RETRY',
        commentedBy: 'Delivery Manager',
        commentedDate: '2026-08-15T10:15:09.000'
      }
    ]
  },
  {
    referenceId: 430,
    recipients: {
      to: ['to+030@test.com', 'to2+30@test.com'],
      cc: ['cc+30@test.com'],
      bcc: []
    },
    tenantId: 'OAO',
    correlationId: '000001ae-0000-4000-8000-0000000001ae',
    customerId: null,
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3030',
    applicationId: 'APP-5006',
    accountId: null,
    source: 'Prospect Management',
    function: null,
    deliveryDateTime: '2026-08-13T14:30:23.000',
    deliveryStatus: 'ERROR_STOP',
    deliveryChannel: 'PUSH',
    failureReason: 'Upstream provider timeout',
    retryCount: 2,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: []
  },
  {
    referenceId: 432,
    recipients: {
      to: ['to+032@test.com', 'to2+32@test.com'],
      cc: [],
      bcc: ['bcc+32@test.com']
    },
    tenantId: 'Mosaic',
    correlationId: '000001b0-0000-4000-8000-0000000001b0',
    customerId: '1032',
    recipientType: 'PROSPECT',
    recipientId: 'P-2032',
    applicationId: null,
    accountId: 'ACCT-6002',
    source: 'Mosaic',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-11T16:36:37.000',
    deliveryStatus: 'PROCESSING',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-08-12T17:43:30.000'
      }
    ]
  },
  {
    referenceId: 435,
    recipients: {
      to: ['to+035@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'OAO',
    correlationId: '000001b3-0000-4000-8000-0000000001b3',
    customerId: '1035',
    recipientType: 'PROSPECT',
    recipientId: null,
    applicationId: 'APP-5011',
    accountId: null,
    source: 'Direct Deposit',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-09T19:45:14.000',
    deliveryStatus: 'ACKNOWLEDGED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: []
  },
  {
    referenceId: 436,
    recipients: {
      to: ['to+036@test.com', 'to2+36@test.com'],
      cc: ['cc+36@test.com'],
      bcc: ['bcc+36@test.com']
    },
    tenantId: 'FCB',
    correlationId: '000001b4-0000-4000-8000-0000000001b4',
    customerId: '1036',
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3036',
    applicationId: null,
    accountId: 'ACCT-6006',
    source: 'Prospect Management',
    function: null,
    deliveryDateTime: '2026-09-08T08:48:21.000',
    deliveryStatus: 'COMPLETE',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: null
  },
  {
    referenceId: 438,
    recipients: {
      to: ['to+038@test.com', 'to2+38@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'CIT',
    correlationId: '000001b6-0000-4000-8000-0000000001b6',
    customerId: '1038',
    recipientType: 'PROSPECT',
    recipientId: 'P-2038',
    applicationId: 'APP-5002',
    accountId: 'ACCT-6008',
    source: 'Mosaic',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-06T10:54:35.000',
    deliveryStatus: 'DISPATCHED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 438.',
        acttion: 'ACKNOWLEDGE',
        commentedBy: 'Ops Team',
        commentedDate: '2026-09-07T10:15:28.000'
      }
    ]
  },
  {
    referenceId: 440,
    recipients: {
      to: ['to+040@test.com', 'to2+40@test.com'],
      cc: [],
      bcc: ['bcc+40@test.com']
    },
    tenantId: 'OAO',
    correlationId: '000001b8-0000-4000-8000-0000000001b8',
    customerId: '1000',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3040',
    applicationId: null,
    accountId: null,
    source: 'Invoice',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-09-04T12:00:49.000',
    deliveryStatus: 'ERROR_RETRY',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: 'Device unreachable',
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: []
  },
  {
    referenceId: 441,
    recipients: {
      to: ['to+041@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'FCB',
    correlationId: '000001b9-0000-4000-8000-0000000001b9',
    customerId: '1001',
    recipientType: 'PROSPECT',
    recipientId: 'P-2041',
    applicationId: 'APP-5005',
    accountId: 'ACCT-6011',
    source: 'Direct Deposit',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-03T13:03:56.000',
    deliveryStatus: 'PROCESSING',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 441.',
        acttion: 'RETRY',
        commentedBy: 'Delivery Manager',
        commentedDate: '2026-09-04T10:15:49.000'
      }
    ]
  },
  {
    referenceId: 442,
    recipients: {
      to: ['to+042@test.com', 'to2+42@test.com'],
      cc: ['cc+42@test.com'],
      bcc: []
    },
    tenantId: 'Mosaic',
    correlationId: '000001ba-0000-4000-8000-0000000001ba',
    customerId: '1002',
    recipientType: 'EMPLOYEE',
    recipientId: null,
    applicationId: 'APP-5006',
    accountId: 'ACCT-6012',
    source: 'Prospect Management',
    function: null,
    deliveryDateTime: '2026-09-02T14:06:03.000',
    deliveryStatus: 'QUEUED',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: [
      {
        comment: 'Queued for handoff.',
        acttion: 'RETRY',
        commentedBy: 'Support Queue',
        commentedDate: '2026-09-03T12:20:56.000'
      },
      {
        comment: 'Follow-up note.',
        acttion: 'ACKNOWLEDGE',
        commentedBy: 'Ops Team',
        commentedDate: '2026-09-03T14:05:56.000'
      }
    ]
  },
  {
    referenceId: 444,
    recipients: {
      to: ['to+044@test.com', 'to2+44@test.com'],
      cc: [],
      bcc: ['bcc+44@test.com']
    },
    tenantId: 'AAO',
    correlationId: '000001bc-0000-4000-8000-0000000001bc',
    customerId: '1004',
    recipientType: 'PROSPECT',
    recipientId: 'P-2044',
    applicationId: null,
    accountId: 'ACCT-6014',
    source: 'Mosaic',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-31T16:12:17.000',
    deliveryStatus: 'ACKNOWLEDGED',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true
  },
  {
    referenceId: 445,
    recipients: {
      to: ['to+045@test.com'],
      cc: ['cc+45@test.com'],
      bcc: []
    },
    tenantId: 'OAO',
    correlationId: '000001bd-0000-4000-8000-0000000001bd',
    customerId: null,
    recipientType: 'EMPLOYEE',
    recipientId: 'R-3045',
    applicationId: 'APP-5009',
    accountId: null,
    source: 'OAO',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-30T17:15:24.000',
    deliveryStatus: 'COMPLETE',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: false,
    comments: null
  },
  {
    referenceId: 419,
    recipients: {
      to: ['to+019@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'AAO',
    correlationId: '000001a3-0000-4000-8000-0000000001a3',
    customerId: '1019',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3019',
    applicationId: 'APP-5007',
    accountId: 'ACCT-6004',
    source: 'DIRECT DEPOSIT1',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-24T15:57:06.000',
    deliveryStatus: 'NEW',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      {
        comment: 'Delivery note for reference 419.',
        acttion: 'RETRY',
        commentedBy: 'Delivery Manager',
        commentedDate: '2026-08-25T10:15:59.000'
      }
    ]
  },
  {
    referenceId: 421,
    recipients: {
      to: ['to+021@test.com'],
      cc: ['cc+21@test.com'],
      bcc: []
    },
    tenantId: 'FCB',
    correlationId: '000001a5-0000-4000-8000-0000000001a5',
    customerId: '1021',
    recipientType: 'EMPLOYEE',
    recipientId: null,
    applicationId: 'APP-5009',
    accountId: 'ACCT-6006',
    source: 'OAO',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-22T17:03:20.000',
    deliveryStatus: 'ERROR_STOP',
    deliveryChannel: 'PUSH',
    failureReason: null,
    retryCount: 1,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: [
      {
        comment: 'Queued for handoff.',
        acttion: 'RETRY',
        commentedBy: 'Support Queue',
        commentedDate: '2026-08-23T12:20:13.000'
      },
      {
        comment: 'Follow-up note.',
        acttion: 'ACKNOWLEDGE',
        commentedBy: 'Ops Team',
        commentedDate: '2026-08-23T14:05:13.000'
      }
    ]
  },
  {
    referenceId: 422,
    recipients: {
      to: ['to+022@test.com', 'to2+22@test.com'],
      cc: [],
      bcc: []
    },
    tenantId: 'Mosaic',
    correlationId: '000001a6-0000-4000-8000-0000000001a6',
    customerId: '1022',
    recipientType: 'CUSTOMER',
    recipientId: 'R-3022',
    applicationId: 'APP-5010',
    accountId: 'ACCT-6007',
    source: 'Invoice',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-21T18:06:27.000',
    deliveryStatus: 'ERROR_RETRY',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: 'Unexpected error in REST call',
    retryCount: 2,
    manualRetryAllowed: true,
    inputAvailable: true
  },
  {
    referenceId: 428,
    recipients: {
      to: ['to+028@test.com', 'to2+28@test.com'],
      cc: [],
      bcc: ['bcc+28@test.com']
    },
    tenantId: 'CIT',
    correlationId: '000001ac-0000-4000-8000-0000000001ac',
    customerId: '1028',
    recipientType: 'CUSTOMER',
    recipientId: null,
    applicationId: null,
    accountId: 'ACCT-6013',
    source: 'Invoice',
    function: 'Alert Dispatch',
    deliveryDateTime: '2026-08-15T12:24:09.000',
    deliveryStatus: 'NEW',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-08-16T17:43:02.000'
      }
    ]
  }
]

/** Slice the static list by dashboard range window (request handling). */
const byDashboardRange = (range: DashboardRangeApi): DeliveryApiItem[] => {
  const cutoffDays = range === 'ONE_WEEK' ? 7 : range === 'THIRTY_DAYS' ? 30 : 14
  const newest = Math.max(
    ...DELIVERIES.map((item) => parseFlexibleDate(item.deliveryDateTime)?.getTime() ?? 0)
  )
  const windowMs = cutoffDays * 24 * 60 * 60 * 1000
  return DELIVERIES.filter((item) => {
    const time = parseFlexibleDate(item.deliveryDateTime)?.getTime() ?? 0
    return newest - time <= windowMs
  })
}

const isProspect = (item: DeliveryApiItem): boolean =>
  item.recipientType.trim().toUpperCase() === 'PROSPECT'

/**
 * Resolve the searchable string for a given searchBy field.
 * ProspectId: only PROSPECT rows; match customerId then recipientId.
 */
const matchesSearch = (
  item: DeliveryApiItem,
  field: DeliveriesStubSearchField,
  keyword: string
): boolean => {
  switch (field) {
    case 'source':
      return item.source.toLowerCase().includes(keyword)
    case 'prospectId': {
      if (!isProspect(item)) return false
      const prospectKey = (item.recipientId ?? item.customerId ?? '').toLowerCase()
      return prospectKey.includes(keyword)
    }
    case 'customerId':
    default: {
      const customerKey = (item.customerId ?? item.recipientId ?? '').toLowerCase()
      return customerKey.includes(keyword)
    }
  }
}

/** GET /alerts-admin/v1/deliveries stub — filters then returns paginated `records` shape. */
export function getDeliveriesStub(params: DeliveriesStubParams = {}): DeliveriesListResponseApi {
  const {
    search,
    searchBy = 'customerId',
    status,
    channel,
    page = 1,
    pageSize = 10,
    range = 'TWO_WEEKS',
    sortField = 'dateTime',
    sortDir = 'desc'
  } = params

  const selectedStatuses = Array.isArray(status) ? status : status ? [status] : []
  const dashboardRange = toDashboardRange(range)

  let items = byDashboardRange(dashboardRange)

  if (search?.trim()) {
    const keyword = search.trim().toLowerCase()
    items = items.filter((item) => matchesSearch(item, searchBy, keyword))
  }

  if (selectedStatuses.length > 0) {
    items = items.filter((item) => selectedStatuses.includes(item.deliveryStatus))
  }

  if (channel && channel !== 'all') {
    items = items.filter((item) => item.deliveryChannel === channel)
  }

  items = [...items].sort((left, right) => {
    if (sortField !== 'dateTime') return 0
    const leftTime = parseFlexibleDate(left.deliveryDateTime)?.getTime() ?? 0
    const rightTime = parseFlexibleDate(right.deliveryDateTime)?.getTime() ?? 0
    return sortDir === 'asc' ? leftTime - rightTime : rightTime - leftTime
  })

  const totalRecords = items.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return {
    page: safePage,
    pageSize,
    totalPages,
    asofDateTime: '2026-09-11T21:00:24.642264381',
    totalRecords,
    records: pageItems
  }
}
