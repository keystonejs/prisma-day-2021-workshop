import { useState } from 'react';

import { Button } from '../components/ui/controls';
import { Container, HomeLink } from '../components/ui/layout';
import { H1 } from '../components/ui/typography';
import { FieldContainer, FieldLabel, TextInput } from '../components/ui/forms';
import { useRouter } from 'next/router';
import { Link } from '../components/ui/link';
import { gql } from '@ts-gql/tag/no-transform';
import { useMutation } from '@apollo/client';

export default function SignupPage() {
  const [signup, { error, data }] = useMutation(
    gql`
      mutation Signup($name: String!, $email: String!, $password: String!) {
        createUser(data: { name: $name, email: $email, password: $password }) {
          __typename
          id
        }
        authenticateUserWithPassword(email: $email, password: $password) {
          __typename
        }
      }
    ` as import('../__generated__/ts-gql/Signup').type
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  return (
    <Container>
      <HomeLink />
      <H1>Join</H1>
      <form
        onSubmit={event => {
          event.preventDefault();
          signup({
            variables: { name, email, password },
            refetchQueries: ['AuthenticatedItem'],
          }).then(result => {
            if (result.data?.createUser) {
              router.push('/');
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
          Sign Up
        </Button>
      </form>
      <hr className="my-4" />
      <div>
        <Link href="/signin">Already have an account? Sign in</Link>
      </div>
    </Container>
  );
}
