import {
  IBM_Plex_Mono as IBMPlexMono,
  Schibsted_Grotesk as SchibstedGrotesk,
} from 'next/font/google';

export const displayA = SchibstedGrotesk({
  subsets: ['latin'],
  variable: '--font-proto-display',
  display: 'swap',
});

export const monoA = IBMPlexMono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-proto-mono',
  display: 'swap',
});
