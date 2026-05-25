import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = { size?: number };

/** Official 4-color Google "G" (paths from srusystem login.html.twig). */
export default function GoogleIcon({ size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityRole="image">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.72 1.22 9.22 3.2l6.85-6.85C35.9 2.98 30.41 1 24 1 14.62 1 6.5 6.3 2.55 14.2l7.98 6.2C12.5 13.6 17.8 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.14-3.06-.41-4.53H24v9.01h12.54c-.54 2.9-2.1 5.36-4.46 7.01l7.3 5.67c4.26-3.93 6.6-9.72 6.6-16.16z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.8c-.98-2.92-.98-6.1 0-9.02l-7.98-6.2C-.92 18.74-1 23.2 1.06 27.68l9.47 1.12z"
      />
      <Path
        fill="#34A853"
        d="M24 47c6.41 0 11.9-2.12 15.87-5.75l-7.3-5.67c-2.03 1.37-4.63 2.17-8.57 2.17-6.2 0-11.5-4.1-13.47-9.9l-7.98 6.2C6.5 41.7 14.62 47 24 47z"
      />
    </Svg>
  );
}
