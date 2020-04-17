import React from 'react'
import { render } from '@testing-library/react'
import { Home } from './Home'
import { createMemoryHistory } from 'history'

test('renders learn react link', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const { getByText } = render(<Home history={history} />)
  const linkElement = getByText(/home\.register/i)
  expect(linkElement).toBeInTheDocument()
})
