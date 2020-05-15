import React from 'react'
import { AppRoutes } from './App'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'
import { createStore } from '@reduxjs/toolkit'
import rootReducer from '../rootReducer'
import { createMemoryHistory, MemoryHistory } from "history"


describe('App', () => {
    let store: ReturnType<typeof createStore>
    let history: MemoryHistory

    function renderRoutes() {
        render(<Provider store={store} >
            <Router history={history}>
                <AppRoutes />
            </Router>
        </Provider>)
    }

    describe('when not authenticated', () => {
        beforeEach(() => {
            store = createStore(rootReducer, { user: { status: 'loggedOut', email: '' } })
            history = createMemoryHistory();
        })

        it('redirects to /login', () => {
            history.replace('/spaces')
            renderRoutes()
            expect(history.entries).toHaveLength(2)
            expect(history.location.pathname).toEqual('/login')
        })

        it('does not redirect when already on /login', () => {
            history.replace('/login')
            renderRoutes()
            expect(history.entries).toHaveLength(1)
            expect(history.location.pathname).toEqual('/login')
        })

        it('does not redirect when already on /', () => {
            history.replace('/')
            renderRoutes()
            expect(history.entries).toHaveLength(1)
            expect(history.location.pathname).toEqual('/')
        })

        it('does not redirect when already on /register', () => {
            history.replace('/register')
            renderRoutes()
            expect(history.entries).toHaveLength(1)
            expect(history.location.pathname).toEqual('/register')
        })
    })

    describe('when authenticated', () => {
        beforeEach(() => {
            store = createStore(rootReducer, { user: { status: 'loggedIn', email: 'foo@bar.com' } })
            history = createMemoryHistory();
        })

        it('does not redirect', () => {
            history.replace('/spaces')
            renderRoutes()
            expect(history.entries).toHaveLength(1)
            expect(history.location.pathname).toEqual('/spaces')
        })
    })
})
