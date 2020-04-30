import React from 'react'
import { render } from '@testing-library/react'
import { Topbar } from './Topbar'
import { MemoryRouter } from 'react-router-dom'

it('renders login link when not logged in', () => {
    const { getByText } = render(<MemoryRouter><Topbar /></MemoryRouter>)
    expect(getByText(/topbar\.login/i)).toBeInTheDocument()
})
