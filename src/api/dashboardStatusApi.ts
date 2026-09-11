import { apiGet, stubDelay, USE_STUBS } from './httpClient'
import {
  toDashboardRange,
  type DashboardChannelPointApi,
  type DashboardChannelResponseApi,
  type DashboardRange,
  type DashboardRangeApi,
  type DashboardStatusPointApi,
  type DashboardStatusResponseApi
} from './contracts'
import { mapDashboardChannelResponse, mapDashboardStatusResponse } from './mapper'
import { getDashboardStatusStub } from '../stubs/dashboardStatusStub'
import { getDashboardChannelStub } from '../stubs/dashboardChannelStub'

export type DashboardStatusPoint = DashboardStatusPointApi
export type DashboardChannelPoint = DashboardChannelPointApi

export type DashboardStatusResponse = {
  range: DashboardRangeApi
  fromDate: string
  toDate: string
  data: DashboardStatusPoint[]
}

export type DashboardChannelResponse = {
  range: DashboardRangeApi
  fromDate: string
  toDate: string
  data: DashboardChannelPoint[]
}

const emptyStatus = (
  range: DashboardRangeApi,
  fromDate: string,
  toDate: string
): DashboardStatusResponse => ({ range, fromDate, toDate, data: [] })

const emptyChannel = (
  range: DashboardRangeApi,
  fromDate: string,
  toDate: string
): DashboardChannelResponse => ({ range, fromDate, toDate, data: [] })

/** GET /alerts-admin/v1/dashboard/status */
export async function fetchDashboardStatus(params: {
  range: DashboardRange
  fromDate: string
  toDate: string
}): Promise<DashboardStatusResponse> {
  const range = toDashboardRange(params.range)

  if (USE_STUBS) {
    await stubDelay()
    const raw = getDashboardStatusStub({
      range,
      fromDate: params.fromDate,
      toDate: params.toDate
    })
    return mapDashboardStatusResponse(raw) ?? emptyStatus(range, params.fromDate, params.toDate)
  }

  const raw = await apiGet<DashboardStatusResponseApi>('/alerts-admin/v1/dashboard/status', {
    range,
    fromDate: params.fromDate,
    toDate: params.toDate
  })

  return mapDashboardStatusResponse(raw) ?? emptyStatus(range, params.fromDate, params.toDate)
}

/** GET /alerts-admin/v1/dashboard/channel */
export async function fetchDeliveryChannelTrend(params: {
  range: DashboardRange
  fromDate: string
  toDate: string
}): Promise<DashboardChannelResponse> {
  const range = toDashboardRange(params.range)

  if (USE_STUBS) {
    await stubDelay()
    const raw = getDashboardChannelStub({
      range,
      fromDate: params.fromDate,
      toDate: params.toDate
    })
    return mapDashboardChannelResponse(raw) ?? emptyChannel(range, params.fromDate, params.toDate)
  }

  const raw = await apiGet<DashboardChannelResponseApi>('/alerts-admin/v1/dashboard/channel', {
    range,
    fromDate: params.fromDate,
    toDate: params.toDate
  })

  return mapDashboardChannelResponse(raw) ?? emptyChannel(range, params.fromDate, params.toDate)
}
