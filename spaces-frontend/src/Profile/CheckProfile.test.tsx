import React from 'react'
import { CheckProfile } from "./CheckProfile"
import { render } from "@testing-library/react"
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from '../rootReducer'
import { MemoryRouter } from 'react-router-dom'

const loggedOutStore = createStore(rootReducer, {
    user: { status: 'loggedOut' },
    profile: { data: null, loadError: null }
})
const loggedInWithoutProfileStore = createStore(rootReducer, {
    user: { status: 'loggedIn' },
    profile: { data: null, loadError: null }
})
const loggedInWithProfileStore = createStore(rootReducer, {
    user: { status: 'loggedIn' },
    profile: {
        data: {
            organizationName: 'foo',
            organizationUrl: 'bar'
        }, loadError: null
    }
})

it('does not show check when not logged in', () => {
    const { queryByText } = render(<Provider store={loggedOutStore}>
        <MemoryRouter>
            <CheckProfile />
        </MemoryRouter>
    </Provider>)
    expect(queryByText(/profile\.completeWarning/)).not.toBeInTheDocument()
})

it('does not show check when profile available', () => {
    const { queryByText } = render(<Provider store={loggedInWithProfileStore}>
        <MemoryRouter>
            <CheckProfile />
        </MemoryRouter>
    </Provider>)
    expect(queryByText(/profile\.completeWarning/)).not.toBeInTheDocument()
})

it('shows when logged in but profile not available', () => {
    const { queryByText } = render(<Provider store={loggedInWithoutProfileStore}>
        <MemoryRouter>
            <CheckProfile />
        </MemoryRouter>
    </Provider>)
    expect(queryByText(/profile\.completeWarning/)).toBeInTheDocument()
})
