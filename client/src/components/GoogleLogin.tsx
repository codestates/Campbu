import { useState, useEffect } from 'react';

export default function GoogleLogin() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get('code');
    console.log(authorizationCode);
    return () => {};
  }, []);

  return <div></div>;
}
