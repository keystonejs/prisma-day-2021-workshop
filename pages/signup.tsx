import React,{ useState } from 'react';
import { gql, useMutation } from 'urql';

import { Button } from '../components/ui/controls';
import { Container, HomeLink } from '../components/ui/layout';
import { H1 } from '../components/ui/typography';
import { FieldContainer, FieldLabel, TextInput } from '../components/ui/forms';
//import { useRouter } from 'next/router';
import { Link } from '../components/ui/link';
import { gotoPage } from '../utils/gotoPage'




export default function SignupPage() {
  const [{ error }, signup] = useMutation(gql`
    mutation ($name: String!, $email: String!, $password: String!) {
      createUser(data: { name: $name, email: $email, password: $password }) {
        __typename
        id
      }
      authenticateUserWithPassword(email: $email, password: $password) {
        __typename
      }
    }
  `);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //const router = useRouter();

  return (
    <Container>
      <HomeLink />
      <H1>Join</H1>
      <form
        onSubmit={event => {
          event.preventDefault();
          signup({ name, email, password }).then(result => {
            if (result.data?.createUser) {
              // FIXME: there's a cache issue with Urql where it's not reloading the
              // current user properly if we do a client-side redirect here.
              // router.push('/');
                gotoPage('/');
            }
          });
        }}
      >
        {error && <div>{error.toString()}</div>}
        <FieldContainer>
          <FieldLabel>Name</FieldLabel>
          <TextInput
            size="large"
            onChange={event => {
              setName(event.target.value);
            }}
          />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Email address</FieldLabel>
          <TextInput
            size="large"
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
        <Link href="/signin">Already have an account? Sign in</Link>
      </div>
    </Container>
  );
}
