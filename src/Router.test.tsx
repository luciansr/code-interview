import React from 'react';
import { render } from '@testing-library/react';
import Router from './Router';

test('renders learn react link', () => {
  const { getByText } = render(<Router />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
