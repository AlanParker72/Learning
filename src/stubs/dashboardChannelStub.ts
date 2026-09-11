import type {
  DashboardChannelPointApi,
  DashboardChannelResponseApi,
  DashboardRangeApi
} from '../api/contracts'

/** Channel series keyed by contract `range`. */
const CHANNEL_BY_RANGE: Record<DashboardRangeApi, DashboardChannelPointApi[]> = {
  ONE_WEEK: [
    { date: '2026-09-03', marketToEmail: 90, smtp: 70, push: 60, total: 220 },
    { date: '2026-09-04', marketToEmail: 110, smtp: 80, push: 75, total: 265 },
    { date: '2026-09-05', marketToEmail: 120, smtp: 90, push: 80, total: 290 },
    { date: '2026-09-06', marketToEmail: 140, smtp: 100, push: 90, total: 330 },
    { date: '2026-09-07', marketToEmail: 145, smtp: 100, push: 95, total: 340 },
    { date: '2026-09-08', marketToEmail: 160, smtp: 120, push: 100, total: 380 },
    { date: '2026-09-09', marketToEmail: 170, smtp: 130, push: 110, total: 410 }
  ],
  TWO_WEEKS: [
    { date: '2026-08-27', marketToEmail: 90, smtp: 80, push: 70, total: 240 },
    { date: '2026-08-28', marketToEmail: 95, smtp: 84, push: 72, total: 251 },
    { date: '2026-08-29', marketToEmail: 100, smtp: 88, push: 76, total: 264 },
    { date: '2026-08-30', marketToEmail: 110, smtp: 90, push: 80, total: 280 },
    { date: '2026-08-31', marketToEmail: 120, smtp: 94, push: 82, total: 296 },
    { date: '2026-09-01', marketToEmail: 130, smtp: 96, push: 86, total: 312 },
    { date: '2026-09-02', marketToEmail: 135, smtp: 100, push: 90, total: 325 },
    { date: '2026-09-03', marketToEmail: 150, smtp: 105, push: 98, total: 353 },
    { date: '2026-09-04', marketToEmail: 155, smtp: 110, push: 100, total: 365 },
    { date: '2026-09-05', marketToEmail: 160, smtp: 112, push: 102, total: 374 },
    { date: '2026-09-06', marketToEmail: 166, smtp: 116, push: 106, total: 388 },
    { date: '2026-09-07', marketToEmail: 170, smtp: 120, push: 110, total: 400 },
    { date: '2026-09-08', marketToEmail: 176, smtp: 130, push: 115, total: 421 },
    { date: '2026-09-09', marketToEmail: 180, smtp: 135, push: 120, total: 435 }
  ],
  THIRTY_DAYS: [
    { date: '2026-08-12', marketToEmail: 80, smtp: 70, push: 50, total: 200 },
    { date: '2026-08-15', marketToEmail: 95, smtp: 80, push: 60, total: 235 },
    { date: '2026-08-18', marketToEmail: 110, smtp: 90, push: 70, total: 270 },
    { date: '2026-08-21', marketToEmail: 120, smtp: 100, push: 75, total: 295 },
    { date: '2026-08-24', marketToEmail: 130, smtp: 110, push: 80, total: 320 },
    { date: '2026-08-27', marketToEmail: 150, smtp: 120, push: 90, total: 360 },
    { date: '2026-08-30', marketToEmail: 160, smtp: 130, push: 100, total: 390 },
    { date: '2026-09-02', marketToEmail: 170, smtp: 130, push: 110, total: 410 },
    { date: '2026-09-05', marketToEmail: 180, smtp: 140, push: 120, total: 440 },
    { date: '2026-09-09', marketToEmail: 180, smtp: 135, push: 120, total: 435 }
  ],
  CUSTOM: [
    { date: '2026-08-27', marketToEmail: 120, smtp: 95, push: 80, total: 295 },
    { date: '2026-08-29', marketToEmail: 135, smtp: 105, push: 82, total: 322 },
    { date: '2026-08-31', marketToEmail: 150, smtp: 110, push: 90, total: 350 },
    { date: '2026-09-02', marketToEmail: 160, smtp: 120, push: 98, total: 378 },
    { date: '2026-09-05', marketToEmail: 170, smtp: 130, push: 100, total: 400 },
    { date: '2026-09-07', marketToEmail: 176, smtp: 135, push: 110, total: 421 },
    { date: '2026-09-09', marketToEmail: 180, smtp: 135, push: 120, total: 435 }
  ]
}

export type DashboardChannelStubParams = {
  range: DashboardRangeApi
  fromDate: string
  toDate: string
}

/** GET /alerts-admin/v1/dashboard/channel stub */
export function getDashboardChannelStub(params: DashboardChannelStubParams): DashboardChannelResponseApi {
  return {
    range: params.range,
    fromDate: params.fromDate,
    toDate: params.toDate,
    data: CHANNEL_BY_RANGE[params.range] ?? CHANNEL_BY_RANGE.TWO_WEEKS
  }
}
