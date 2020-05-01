import React from 'react'
import { render } from '@testing-library/react'
import { Topbar } from './Topbar'
import { MemoryRouter } from 'react-router-dom'
import { createStore } from 'redux'
import rootReducer from '../rootReducer'
import { Provider } from 'react-redux'

const loggedOutStore = createStore(rootReducer, { user: { status: 'loggedOut' } })
const loggedInStore = createStore(rootReducer, { user: { status: 'loggedIn' } })

it('renders login link when not logged in', () => {
    const { getByText } = render(<Provider store={loggedOutStore}>
        <MemoryRouter><Topbar /></MemoryRouter>
    </Provider>)
    expect(getByText(/topbar\.login/i)).toBeInTheDocument()
})

it('renders no login link when already logged in', () => {
    const { queryByText } = render(<Provider store={loggedInStore}>
        <MemoryRouter><Topbar /></MemoryRouter>
    </Provider>)
    expect(queryByText(/topbar\.login/i)).not.toBeInTheDocument()
})

it('renders register link when not logged in', () => {
    const { getByText } = render(<Provider store={loggedOutStore}>
        <MemoryRouter><Topbar /></MemoryRouter>
    </Provider>)
    expect(getByText(/topbar\.register/i)).toBeInTheDocument()
})

it('renders no register link when already logged in', () => {
    const { queryByText } = render(<Provider store={loggedInStore}>
        <MemoryRouter><Topbar /></MemoryRouter>
    </Provider>)
    expect(queryByText(/topbar\.register/i)).not.toBeInTheDocument()
})
