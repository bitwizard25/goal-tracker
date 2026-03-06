import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import stylesheet from '~/styles/globals.css?url';
import { connectDB } from './lib/db.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  },
];

export const loader: LoaderFunction = async () => {
  await connectDB();
  return null;
};

export const meta = () => [
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { title: 'Goal Tracker - Psychological Goal Management' },
  {
    name: 'description',
    content:
      'Advanced goal tracking with energy-emotion tracking, habit formation, and gamification.',
  },
];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
