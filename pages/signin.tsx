import React, { useState } from 'react';

import { Button } from '../components/ui/controls';
import { Container, HomeLink } from '../components/ui/layout';
import { H1 } from '../components/ui/typography';
import { FieldContainer, FieldLabel, TextInput } from '../components/ui/forms';
import { Link } from '../components/ui/link';
//import { useRouter } from 'next/router';
import { useAuth } from '../components/auth';
import { gotoPage } from '../utils/gotoPage'

export default function SigninPage() {
  const auth = useAuth();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  // const router = useRouter();

  const signIn = async () => {
    if (!auth.ready) {
      setError('Auth is not ready, try again in a moment.');
      return;
    }
    if (!email.length || !password.length) {
      setError('Please enter a username and password.');
      return;
    }
    setError('');
    const result = await auth.signIn({ email, password });
    if (result.success) {


      gotoPage('/');
    } 
    else {
      setEmail('');
      setPassword('');
      setError(result.message);
    }
  };

  return (
    <Container>
      <HomeLink />
      <H1>Sign in</H1>
      {error ? <div>{error}</div> : null}
      <form
        onSubmit={event => {
          event.preventDefault();
          signIn();
        }}
      >
        <FieldContainer>
          <FieldLabel>Email address</FieldLabel>
          <TextInput
            size="large"
            value={email}
            onChange={event => {
              setEmail(event.target.value);
            }}
          />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Password</FieldLabel>
          <TextInput
            size="large"
            type="password"
            value={password}
            onChange={event => {
              setPassword(event.target.value);
            }}
          />
        </FieldContainer>
        <Button type="submit" size="large" appearance="primary">
          Sign In
        </Button>
      </form>
      <hr className="my-4" />
      <div>
        <Link href="/signup">Want to join instead?</Link>
      </div>
    </Container>
  );
}
