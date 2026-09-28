import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Can } from './Can'
import { Permission } from './permissions'
import { Role } from './roles'
import { useAuthStore } from '../store/authStore'

describe('Can', () => {
  it('renders children when permission is granted', () => {
    useAuthStore.setState({
      activeRole: Role.O_MANAGER,
      roles: [Role.O_MANAGER]
    })
    render(
      <Can permission={Permission.ACTION_REASSIGN}>
        <span>Reassign control</span>
      </Can>
    )
    expect(screen.getByText('Reassign control')).toBeInTheDocument()
  })

  it('hides children when permission is missing', () => {
    useAuthStore.setState({
      activeRole: Role.O_ANALYST,
      roles: [Role.O_ANALYST]
    })
    render(
      <Can permission={Permission.ACTION_REASSIGN} fallback={<span>Hidden</span>}>
        <span>Reassign control</span>
      </Can>
    )
    expect(screen.queryByText('Reassign control')).not.toBeInTheDocument()
    expect(screen.getByText('Hidden')).toBeInTheDocument()
  })
})
